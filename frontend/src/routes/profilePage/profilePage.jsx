import "./profilePage.css";
import ImageComponent from "../../components/image/image";
import { useState } from "react";
import Boards from "../../components/boards/boards.jsx";
import Gallery from "../../components/gallery/gallery";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import apiReq from "../../utils/apiReq.js";
import FollowButton from "./FollowButton.jsx";

export default function ProfilePage() {
  const [type, setType] = useState("saved");

  const {username: userName} = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["profile", userName],
    queryFn: () => apiReq.get(`/users/${userName}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "Error has occurred: " + error.message;
  if (!data) return "User not found.";

  return (
    <div className="profilePage">
      <ImageComponent
        className="profileImg"
        w={100}
        h={100}
        path={data.img || "/general/noAvatar.png"}
        alt=""
      />
      <h1 className="profileName">{data.displayName}</h1>
      <span className="profileUser">@{data.userName}</span>
      <div className="followers">{data.followerCount} followers | {data.followingCount} following</div>
      <div className="profileActions">
        <ImageComponent path="/general/share.svg" alt="" />
        <div className="profileButtons">
          <button>Message</button>
          <FollowButton isFollowing={data.isFollowing} userName={data.userName} />
        </div>
        <ImageComponent path="/general/more.svg" alt="" />
      </div>
      <div className="profileOptions">
        <span
          className={type === "created" ? "active" : ""}
          onClick={() => setType("created")}
        >
          Created
        </span>
        <span
          className={type === "saved" ? "active" : ""}
          onClick={() => setType("saved")}
        >
          Saved
        </span>
      </div>
      {type === "created" ? <Gallery userId={data._id} /> : <Boards userId={data._id} />}
    </div>
  );
}
