import { Area } from "./area";
import { Position } from "../geometry/position"

export interface AreaBuilder{
    addPosition(position: Position): void;
    addArea(area: Area): void;
}