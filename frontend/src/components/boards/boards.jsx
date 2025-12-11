import "./boards.css";
import ImageComponent from "../image/image";
import { useQuery } from "@tanstack/react-query";
import apiReq from "../../utils/apiReq";
import TimeAgo from 'javascript-time-ago';
import { Link } from "react-router";

export default function Boards({ userId }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["boards", userId],
    queryFn: () => apiReq.get(`/boards/${userId}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "Error has occurred: " + error.message;

  const timeAgo = new TimeAgo('en-US')

  return (
    <div className="collections">
      {data?.map((board) => (
        <Link to={`/search?boardId=${board._id}`} className="collection" key={board._id}>
          <ImageComponent path={board.firstPin.media} alt="" />
          <div className="collectionInfo">
            <h1>{board.title}</h1>
            <span>{board.pinsCount} Pins | {timeAgo.format(new Date(board.createdAt) - 2 * 60 * 60 * 1000)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
