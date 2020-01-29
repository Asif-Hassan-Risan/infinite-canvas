import { Area } from "./area";
import { Point } from "../point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";
import { PathInstruction } from "../interfaces/path-instruction";
import { AreaChange } from "./area-change";

export class PointArea implements Area{
    constructor(private readonly point: Point){}
    public expandToInclude(area: Area): Area {
        return area.expandToIncludePoint(this.point);
    }
    public expandToIncludeRectangle(rectangle: Rectangle): Area {
        return this.expandToInclude(rectangle);
    }
    public expandToIncludePoint(point: Point): Area {
        return new Rectangle(this.point.x, this.point.y, 0, 0).expandToIncludePoint(point);
    }
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
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return rectangle.containsPoint(this.point);
    }
    public intersects(area: Area): boolean {
        return area.containsPoint(this.point);
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        return this.intersects(rectangle);
    }
    public getInstructionToClear(): PathInstruction {
       return {
           instruction: () => {},
           changeArea: AreaChange.to()
       };
    }
    
}