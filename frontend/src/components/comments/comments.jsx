import "./comments.css";
import ImageComponent from "../image/image.jsx";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiReq from "../../utils/apiReq.js";
import TimeAgo from "javascript-time-ago";

const addComment = async (comment) => {
  const res = await apiReq.post("/comments", comment);
  return res.data;
}

export default function Comments({ id }) {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");

  const handleEmojiClick = (emoji) => {
    setDesc((prev) => prev + emoji.emoji);
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ description: desc, pin: id });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn:addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] })
      setDesc("")
      setOpen(false);
    },
  })

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => apiReq.get(`/comments/${id}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "Error has occurred: " + error.message;

  const timeAgo = new TimeAgo("en-US");

  return (
    <div className="comments">
      <div className="commentList">
        <span className="commentCount">
          {data.length === 0 ? "No comments" : `${data.length} comments`}
        </span>
        {/* Comment items would go here */}
        {data?.map((comment) => (
          <div className="comment" key={comment._id}>
            <ImageComponent
              path={comment.user.img || "/general/noAvatar.png"}
              alt=""
            />
            <div className="commentContent">
              <span className="commentUser">{comment.user.displayName}</span>
              <p className="commentText">{comment.description}</p>
              <span className="commentTime">
                {timeAgo.format(
                  new Date(comment.createdAt) - 2 * 60 * 60 * 1000
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form className="commentForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <div className="emoji">
          <div onClick={() => setOpen(!open)}>😀</div>
          {open && (
            <div className="emojiPicker">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
