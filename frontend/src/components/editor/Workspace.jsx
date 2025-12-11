import { use, useEffect, useRef } from "react";
import useEditorStore from "../../utils/editorStore";
import ImageComponent from "../image/image";

export default function Workspace({ previewImg }) {
  const { setSelectedLayer, textOptions, setTextOptions, canvasOptions, setCanvasOptions } =
    useEditorStore();
  useEffect(() => {
    if (canvasOptions.height === 0) {
      const canvasHeight = (375 * previewImg.height) / previewImg.width;
      setCanvasOptions({
        ...canvasOptions,
        height: canvasHeight,
        orientation: canvasHeight > 375 ? "portrait" : "landscape",
      });
    }
  }, [previewImg, canvasOptions, setCanvasOptions]);

  const itemRef = useRef(null);
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if(!dragging.current) return;
    setTextOptions({
      ...textOptions,
      left: e.clientX - offset.current.x,
      top: e.clientY - offset.current.y,
    })
  };

  const handleMouseUp = (e) => {
    dragging.current = false;
  };

  const handleMouseLeave = (e) => {
    dragging.current = false;
  };

  const handleMouseDown = (e) => {
    setSelectedLayer("text");
    dragging.current = true;
    offset.current = {
      x: e.clientX - textOptions.left,
      y: e.clientY - textOptions.top,
    };
  };


  return (
    <div className="workspace">
      <div
        className="canvas"
        style={{
          height: canvasOptions.height,
          backgroundColor: canvasOptions.backgroundColor,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <img src={previewImg.url} alt="" />
        {textOptions.text && (
          <div
            className="text"
            style={{
              left: textOptions.left,
              top: textOptions.top,
              fontSize: `${textOptions.fontSize}px`,
            }}
            onMouseDown={handleMouseDown}
            ref={itemRef}
          >
            <input
              type="text"
              value={textOptions.text}
              onChange={(e) =>
                setTextOptions({ ...textOptions, text: e.target.value })
              }
              style={{
                color: textOptions.color,
              }}
            />
            <div
              className="deleteText"
              onClick={() =>
                setTextOptions({
                  ...textOptions,
                  text: "",
                })
              }
            >
              <ImageComponent path="/general/delete.svg" alt="" w={24} h={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
