import { Link } from "react-router";
import ImageComponent from "../image/image";
import "./galleryItem.css";

const GalleryItem = ({ item }) => {
  const optimizedHeight = (372 * item.height) / item.width;
  return (
    <div
      className="galleryItem"
      style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}
    >
      <ImageComponent path={item.media} w={372} h={optimizedHeight} alt="" className="galleryImage" />
      <Link to={`/pin/${item._id}`} className="overlay" />
      <button className="saveButton">Save</button>
      <div className="overlayIcons">
        <button>
          <ImageComponent path="/general/share.svg" alt="" />
        </button>
        <button>
          <ImageComponent path="/general/more.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default GalleryItem;
