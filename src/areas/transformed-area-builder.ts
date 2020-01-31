import { AreaBuilder } from "./area-builder";
import { Transformation } from "../transformation";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";
import { InfiniteCanvasAreaBuilder } from "./infinite-canvas-area-builder";

export class TransformedAreaBuilder implements AreaBuilder{
    constructor(private readonly areaBuilder: InfiniteCanvasAreaBuilder, private readonly transformation: Transformation){}
    public addPoint(point: Point): void{
        this.areaBuilder.addPoint(this.transformation.apply(point));
    }
    public addRectangle(rectangle: Rectangle): void{
        this.areaBuilder.addRectangle(rectangle.transform(this.transformation));
    }
}