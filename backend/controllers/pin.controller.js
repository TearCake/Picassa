import Pin from "../models/pin.model.js";
import User from "../models/user.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import sharp from "sharp";
import ImageKit from "imagekit";
import { response } from "express";
import jwt from "jsonwebtoken";

export const getPins = async (req, res) => {
  const LIMIT = 21;
  const pageNum = Number(req.query.cursor) || 0;
  const search = req.query.search;
  const userId = req.query.userId;
  const boardId = req.query.boardId;

  const searchQuery = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      }
    : userId
    ? { user: userId }
    : boardId
    ? { board: boardId }
    : {};

  const pins = await Pin.find(searchQuery)
    .limit(LIMIT)
    .skip(pageNum * LIMIT);

  const hasNextPage = pins.length === LIMIT;

  res.status(200).json({ pins, nextCursor: hasNextPage ? pageNum + 1 : null });
};

export const getPin = async (req, res) => {
  const { id } = req.params;
  console.log("Requested pin ID:", id);
  try {
    const pin = await Pin.findById(id).populate(
      "user",
      "userName img displayName"
    );

    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }
    if (!pin.user) {
      // Check if user field exists but wasn't populated
      const pinRaw = await Pin.findById(id);

      return res
        .status(404)
        .json({ message: "User not found for this pin", userId: pinRaw.user });
    }
    res.status(200).json(pin);
  } catch (error) {
    console.error("Error fetching pin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPin = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      board,
      tags,
      textOptions,
      canvasOptions,
    } = req.body;

    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const media = req.files?.media;

    if (!title || !description || !media) {
      return res
        .status(400)
        .json({ message: "Title, description, and media are required" });
    }

    const parsedTextOptions = textOptions ? JSON.parse(textOptions) : {};
    const parsedCanvasOptions = canvasOptions ? JSON.parse(canvasOptions) : {};

    console.log("Parsed text options:", parsedTextOptions);
    console.log("Parsed canvas options:", parsedCanvasOptions);

    const metadata = await sharp(media.data).metadata();
    console.log("Image metadata:", metadata);

    const originalOrientation =
      metadata.width < metadata.height ? "portrait" : "landscape";
    const originalAspectRatio = metadata.width / metadata.height;

    console.log("Original orientation:", originalOrientation);
    console.log("Original aspect ratio:", originalAspectRatio);

    let clientAspectRatio;
    let width, height;

    if (parsedCanvasOptions.size && parsedCanvasOptions.size !== "original") {
      const sizeParts = parsedCanvasOptions.size.split(":");
      clientAspectRatio = Number(sizeParts[0]) / Number(sizeParts[1]);
    } else {
      clientAspectRatio =
        parsedCanvasOptions.orientation === originalOrientation
          ? originalAspectRatio
          : 1 / originalAspectRatio;
    }

    console.log("Client aspect ratio:", clientAspectRatio);

    width = metadata.width;
    height = metadata.width / clientAspectRatio;

    console.log("Calculated dimensions:", { width, height });

    const imagekit = new ImageKit({
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
      urlEndpoint: process.env.IK_URL_ENDPOINT,
    });

    console.log("ImageKit instance:", imagekit);
    console.log("ImageKit upload method:", typeof imagekit.upload);

    const textLeftPosition = Math.max(
      0,
      Math.round((parsedTextOptions.left * width) / 375)
    );
    const textTopPosition = Math.max(
      0,
      Math.round((parsedTextOptions.top * height) / parsedCanvasOptions.height)
    );

    let croppingStrategy = "";

    if (parsedCanvasOptions.size !== "original") {
      if (originalAspectRatio > clientAspectRatio) {
        croppingStrategy = ",cm-pad_resize";
      }
    } else {
      if (
        originalOrientation === "landscape" &&
        parsedCanvasOptions.orientation === "portrait"
      ) {
        croppingStrategy = ",cm-pad_resize";
      }
    }

    const transformationString = `w-${width},h-${height}${croppingStrategy},bg-${parsedCanvasOptions.backgroundColor.substring(
      1
    )}${
      parsedTextOptions.text
        ? `,l-text,i-${parsedTextOptions.text},fs-${
            parsedTextOptions.fontSize * 2.1
          },lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(
            1
          )},l-end`
        : ""
    }`;

    imagekit
      .upload({
        file: media.data,
        fileName: media.name,
        folder: "/pins/",
        transformation: {
          pre: transformationString,
        },
      })
      .then(async (response) => {
        const newPin = await Pin.create({
          user: req.userId,
          title,
          description,
          link: link || null,
          board:
            board && board !== "1" && board.match(/^[0-9a-fA-F]{24}$/)
              ? board
              : null,
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
          media: response.filePath,
          width: response.width,
          height: response.height,
        });
        return res.status(201).json(newPin);
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Image upload failed", error: error.message });
      });
  } catch (error) {
    console.error("Error in createPin:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const interactionCheck = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const likeCount = await Like.countDocuments({ pin: id });
  if (!token) {
    return res.status(200).json({
      likeCount,
      isLiked: false,
      isSaved: false,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json("Invalid token");
    const userId = payload.userId;
    const isLiked = await Like.findOne({ user: userId, pin: id });
    const isSaved = await Save.findOne({ user: userId, pin: id });

    return res.status(200).json({
      likeCount,
      isLiked: isLiked ? true : false,
      isSaved: isSaved ? true : false,
    });
  });
};

export const interact = async (req, res) => {
  const { id } = req.params;
  const { action, type } = req.body;

  if (type === "like") {
    const isLiked = await Like.findOne({
      pin: id,
      user: req.userId,
    });

    if (isLiked) {
      await Like.deleteOne({ pin: id, user: req.userId });
    } else {
      await Like.create({ pin: id, user: req.userId });
    }
  } else {
    const isSaved = await Save.findOne({
      pin: id,
      user: req.userId,
    });

    if (isSaved) {
      await Save.deleteOne({ pin: id, user: req.userId });
    } else {
      await Save.create({ pin: id, user: req.userId });
    }
  }
  return res.status(200).json({ message: "Interaction updated" });
};
