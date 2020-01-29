import { PartOfDrawing } from "./part-of-drawing";
import { Area } from "../areas/area";

export interface Drawing extends PartOfDrawing{
    clearContentsInsideArea(area: Area): void;
    addClearRect(area: Area): void;
}