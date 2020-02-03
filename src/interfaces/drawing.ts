import { PartOfDrawing } from "./part-of-drawing";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Area } from "../areas/area";

export interface Drawing extends PartOfDrawing{
    clearContentsInsideArea(area: Area): void;
    addClearRect(area: Area, state: InfiniteCanvasState): void;
}
