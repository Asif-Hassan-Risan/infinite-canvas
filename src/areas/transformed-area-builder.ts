import { AreaBuilder } from "./area-builder";
import { Transformation } from "../transformation";
import { InfiniteCanvasAreaBuilder } from "./infinite-canvas-area-builder";
import { Area } from "./area";
import { transformPosition } from "../geometry/transform-position";
import { Position } from "../geometry/position"

export class TransformedAreaBuilder implements AreaBuilder{
    constructor(private readonly areaBuilder: InfiniteCanvasAreaBuilder, private readonly transformation: Transformation){}
    public addPosition(position: Position): void{
        this.areaBuilder.addPosition(transformPosition(position, this.transformation));
    }
    public addArea(area: Area): void{
        this.areaBuilder.addArea(area.transform(this.transformation));
    }
}