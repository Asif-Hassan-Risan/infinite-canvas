import { Area } from "./area";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";
import { PathInstruction } from "../interfaces/path-instruction";
import { AreaBuilder } from "./area-builder";
import { HalfPlane } from "./half-plane";

export class PointArea implements Area{
    constructor(private readonly point: Point){}
    public transform(transformation: Transformation): Area {
        return new PointArea(transformation.apply(this.point))
    }
    public intersectWith(area: Area): Area {
        if(area.containsPoint(this.point)){
            return this;
        }
        return undefined;
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        return this.intersectWith(rectangle);
    }
    public contains(area: Area): boolean {
        return area.isContainedByRectangle(new Rectangle(this.point.x, this.point.y, 0, 0));
    }
    public containsPoint(point: Point): boolean{
        return point.x === this.point.x && point.y === this.point.y;
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        return halfPlane.containsPoint(this.point);
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return rectangle.containsPoint(this.point);
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        return rectangle.containsPoint(this.point);
    }
    public getInstructionToClear(): PathInstruction {
       return {
           instruction: () => {},
           changeArea: (builder: AreaBuilder) => builder.addPoint(this.point)
       };
    }
    
}
