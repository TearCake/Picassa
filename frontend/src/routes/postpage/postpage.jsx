import "./postpage.css";
import ImageComponent from "../../components/image/image.jsx";
import PostInt from "../../components/postInt/postInt";
import Comments from "../../components/comments/comments.jsx";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiReq from "../../utils/apiReq.js";

export default function PostPage() {
  const { id } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["pin", id],
    queryFn: () => apiReq.get(`/pins/${id}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "Error has occurred: " + error.message;
  if (!data) return "No post found.";
  if (!data.user) return "User data not available for this post.";

  console.log(data);

  return (
    <div className="postPage">
      <div className="postContainer">
        <div className="postImg">
          <ImageComponent path={data.media} alt="" w={736} />
        </div>
        <div className="postDetails">
          <PostInt postId={id} />
          <Link to={`/${data.user.userName}`} className="postUser">
            <ImageComponent path={data.user.img || "/general/noAvatar.png"} />
            <span>{data.user.displayName}</span>
          </Link>
          <Comments id={data._id} />
        </div>
      </div>
    </div>
  );
}
