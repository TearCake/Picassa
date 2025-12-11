import "./searchPage.css";
import Gallery from "../../components/gallery/gallery";
import { useSearchParams } from "react-router";

export default function SearchPage() {
  let [searchParams] = useSearchParams();

  const search = searchParams.get("search");
  const boardId = searchParams.get("boardId");

  return <Gallery search={search} boardId={boardId} />;
}
