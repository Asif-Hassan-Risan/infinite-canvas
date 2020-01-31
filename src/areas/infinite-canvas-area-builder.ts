import { Area } from "./area";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { TransformedAreaBuilder } from "./transformed-area-builder";

export class InfiniteCanvasAreaBuilder {
    constructor(private rectangle?: Rectangle){}
    public get area(): Area{return this.rectangle;}
    public addPoint(point: Point): void{
        if(!this.rectangle){
            this.rectangle = new Rectangle(point.x, point.y, 0, 0);
        }else{
            this.rectangle = this.rectangle.expandToIncludePoint(point);
        }
    }
    public addRectangle(rectangle: Rectangle): void{
        if(!this.rectangle){
            this.rectangle = rectangle;
        }else{
            this.rectangle = this.rectangle.expandToIncludeRectangle(rectangle);
        }
    }
    public transformedWith(transformation: Transformation): AreaBuilder{
        return new TransformedAreaBuilder(this, transformation);
    }
    public copy(): InfiniteCanvasAreaBuilder{
        return new InfiniteCanvasAreaBuilder(this.rectangle);
    }
}