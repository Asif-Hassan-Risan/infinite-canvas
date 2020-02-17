import { Area } from "./area";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { TransformedAreaBuilder } from "./transformed-area-builder";
import { empty } from "./empty";
import { LineSegment } from "./line-segment";
import { Ray } from "./ray";

export class InfiniteCanvasAreaBuilder {
    constructor(private _area?: Area, private firstPoint?: Point, private infinityDirection1?: Point, private infinityDirection2?: Point){}
    public get area(): Area{return this._area || empty;}
    public addPoint(point: Point): void{
        if(this._area){
            this._area = this._area.expandToIncludePoint(point);
        }else{
            if(this.firstPoint){
                this.addToFirstPoint(point);
            }else{
                this.firstPoint = point;
            }
        }
    }
    private addToFirstPoint(point: Point): void{
        if(!point.equals(this.firstPoint)){
            this._area = new LineSegment(this.firstPoint, point);
        }
    }
    public addInfinityInDirection(direction: Point): void{
        if(this._area){
            this._area = this._area.expandToIncludeInfinityInDirection(direction);
        }else{
            if(this.firstPoint){
                this._area = new Ray(this.firstPoint, direction);
            }else{

            }
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
        return new InfiniteCanvasAreaBuilder(this._area, this.firstPoint, this.infinityDirection1, this.infinityDirection2);
    }
}