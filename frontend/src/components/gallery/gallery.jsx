import GalleryItem from "../galleryItem/galleryItem.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import "./gallery.css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const fetchPins = async ({ pageParam, search, userId, boardId }) => {
  const res = await axios.get(
    "http://localhost:3000/pins?cursor=" +
      pageParam +
      (search ? `&search=${search}` : "") +
      (userId ? `&userId=${userId}` : "") +
      (boardId ? `&boardId=${boardId}` : "")
  );
  return res.data;
};

export default function Gallery({ search, userId, boardId }) {
  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["pins", search, userId, boardId],
    queryFn: ({ pageParam = 0 }) => fetchPins({ pageParam, search, userId, boardId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  if (status === "error") return "An error occurred! ";
  if (status === "pending") return "Loading...";

  console.log(data);

  const allPins = data?.pages.flatMap((pages) => pages.pins) || [];

  return (
    <InfiniteScroll
      dataLength={allPins.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading...</h4>}
      endMessage={<h3>All Posts Loaded!</h3>}
    >
      <div className="gallery">
        {allPins.map((item) => (
          <GalleryItem key={item._id} item={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
