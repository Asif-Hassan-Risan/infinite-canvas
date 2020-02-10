import { Area } from "./area";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { TransformedAreaBuilder } from "./transformed-area-builder";
import { ConvexPolygon } from "./convex-polygon";
import { HalfPlane } from "./half-plane";
import { empty } from "./empty";

export class InfiniteCanvasAreaBuilder {
    constructor(private _area?: Area, private firstPoint?: Point,  private secondPoint?: Point){}
    public get area(): Area{return this._area || empty;}
    public addPoint(point: Point): void{
        if(!this._area){
            if(!this.firstPoint){
                this.firstPoint = point;
            }else if(!this.secondPoint){
                this.secondPoint = point;
            }else{
                this._area = InfiniteCanvasAreaBuilder.createTriangle(this.firstPoint, this.secondPoint, point);
            }
        }else{
            this._area = this._area.expandToIncludePoint(point);
        }
    }
    public addRectangle(rectangle: Rectangle): void{
        if(!this._area){
            this._area = rectangle;
        }else{
            this._area = this._area.expandToIncludePolygon(rectangle);
        }
    }
    public transformedWith(transformation: Transformation): AreaBuilder{
        return new TransformedAreaBuilder(this, transformation);
    }
    public copy(): InfiniteCanvasAreaBuilder{
        return new InfiniteCanvasAreaBuilder(this._area, this.firstPoint, this.secondPoint);
    }
    private static createTriangle(point1: Point, point2: Point, point3: Point): ConvexPolygon{
        return new ConvexPolygon([
            HalfPlane.throughPointsAndContainingPoint(point1, point2, point3),
            HalfPlane.throughPointsAndContainingPoint(point1, point3, point2),
            HalfPlane.throughPointsAndContainingPoint(point2, point3, point1),
        ])
    }
}