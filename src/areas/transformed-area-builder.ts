import { AreaBuilder } from "./area-builder";
import { Transformation } from "../transformation";
import { Point } from "../geometry/point";
import { InfiniteCanvasAreaBuilder } from "./infinite-canvas-area-builder";
import { Area } from "./area";

export class TransformedAreaBuilder implements AreaBuilder{
    constructor(private readonly areaBuilder: InfiniteCanvasAreaBuilder, private readonly transformation: Transformation){}
    public addPoint(point: Point): void{
        this.areaBuilder.addPoint(this.transformation.apply(point));
    }
    public addInfinityInDirection(direction: Point): void{
        
    }
    public addArea(area: Area): void{
        this.areaBuilder.addArea(area.transform(this.transformation));
    }
}