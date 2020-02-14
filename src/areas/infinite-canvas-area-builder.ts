import { Area } from "./area";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { TransformedAreaBuilder } from "./transformed-area-builder";
import { ConvexPolygon } from "./convex-polygon";
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
                this._area = ConvexPolygon.createTriangle(this.firstPoint, this.secondPoint, point);
            }
        }else{
            this._area = this._area.expandToIncludePoint(point);
        }
    }
    public addArea(area: Area): void{
        if(!this._area){
            this._area = area;
        }else{
            this._area = this._area.expandToInclude(area);
        }
    }
    public transformedWith(transformation: Transformation): AreaBuilder{
        return new TransformedAreaBuilder(this, transformation);
    }
    public copy(): InfiniteCanvasAreaBuilder{
        return new InfiniteCanvasAreaBuilder(this._area, this.firstPoint, this.secondPoint);
    }
}