import { create } from "zustand";

const useEditorStore = create((set) => ({
  selectedLayer: "canvas",
  textOptions: {
    text: "",
    fontSize: 48,
    color: "#000000",
    top: 48,
    left: 0,
  },
  canvasOptions: {
    height:0,
    orientation: "",
    size: "original",
    backgroundColor: "#00ff55ff",
  },
  setSelectedLayer: (newLayer) => set({ selectedLayer: newLayer }),
  setTextOptions: (newOptions) => set({ textOptions: newOptions }),
  addText: () =>
    set({
      textOptions: {
        text: "Add text",
        fontSize: 48,
        color: "#000000",
        top: 48,
        left: 0,
      }, 
    }),
  setCanvasOptions: (newOptions) => set({ canvasOptions: newOptions }),
}));

export default useEditorStore;
