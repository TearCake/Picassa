import "./editor.css";
import Layers from "./Layers";
import Workspace from "./Workspace";
import Options from "./Options";

export default function Editor({previewImg}) {
  return (
    <div className="editor">
      <Layers previewImg={previewImg} />
      <Workspace previewImg={previewImg} />
      <Options previewImg={previewImg} />
    </div>
  )
}
