import { Area } from "./area";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { TransformedAreaBuilder } from "./transformed-area-builder";
import { empty } from "./empty";
import { LineSegment } from "./line-segment";
import { Ray } from "./ray";
import { ConvexPolygon } from "./convex-polygon";
import { Line } from "./line";

export class InfiniteCanvasAreaBuilder {
    constructor(private _area?: Area, private firstPoint?: Point, private infinityDirection1?: Point, private infinityDirection2?: Point){}
    public get area(): Area{return this._area || empty;}
    public addPoint(point: Point): void{
        if(this._area){
            this._area = this._area.expandToIncludePoint(point);
        }else{
            if(this.firstPoint){
                if(!point.equals(this.firstPoint)){
                    this._area = new LineSegment(this.firstPoint, point);
                }
            }else if(this.infinityDirection1){
                if(this.infinityDirection2){
                    this._area = ConvexPolygon.createTriangleWithInfinityInTwoDirections(point, this.infinityDirection1, this.infinityDirection2);
                }else{
                    this._area = new Ray(point, this.infinityDirection1);
                }
            }else{
                this.firstPoint = point;
            }
        }
    }

    public addInfinityInDirection(direction: Point): void{
        if(this._area){
            this._area = this._area.expandToIncludeInfinityInDirection(direction);
        }else{
            if(this.firstPoint){
                this._area = new Ray(this.firstPoint, direction);
            }else if(this.infinityDirection1){
                if(this.infinityDirection2){

                }else{
                    if(!direction.inSameDirectionAs(this.infinityDirection1)){
                        
                    }
                }
            }else{
                this.infinityDirection1 = direction;
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