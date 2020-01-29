import { Point } from "../point";
import { Transformation } from "../transformation";
import { isPoint } from "./is-point";
import { PathInstructions } from "../instructions/path-instructions";
import { PathInstruction } from "../interfaces/path-instruction";
import { Area } from "./area";

export class Rectangle implements Area{
    private vertices: Point[];
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;
    constructor(x: number, y: number, width: number, height: number){
        this.vertices = [{x:x, y:y}, {x: x + width, y:y}, {x:x, y: y + height}, {x: x + width, y: y + height}];
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }
    public expandToIncludePoint(point: Point): Area{
        const left: number = Math.min(point.x, this.left);
        const right: number = Math.max(point.x, this.right);
        const top: number = Math.min(point.y, this.top);
        const bottom: number = Math.max(point.y, this.bottom);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    public expandToIncludeRectangle(rectangle: Rectangle): Area{
        const left: number = Math.min(rectangle.left, this.left);
        const right: number = Math.max(rectangle.right, this.right);
        const top: number = Math.min(rectangle.top, this.top);
        const bottom: number = Math.max(rectangle.bottom, this.bottom);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    public expandToInclude(area: Area): Area{
        return area.expandToIncludeRectangle(this);
    }
    public getInstructionToClear(): PathInstruction{
        const x: number = this.left;
        const y: number = this.top;
        const width: number = this.right - this.left;
        const height: number = this.bottom - this.top;
        return PathInstructions.clearRect(x, y, width, height);
    }
    public intersectWithRectangle(other: Rectangle): Area{
        if(this.contains(other)){
            return other;
        }
        if(other.contains(this)){
            return this;
        }
        if(!this.intersects(other)){
            return undefined;
        }
        const newTop: number = Math.max(this.top, other.top);
        const newBottom: number = Math.min(this.bottom, other.bottom);
        const newLeft: number = Math.max(this.left, other.left);
        const newRight: number = Math.min(this.right, other.right);
        return new Rectangle(newLeft, newTop, newRight - newLeft, newBottom - newTop);
    }
    public intersectWith(other: Area): Area{
        return other.intersectWithRectangle(this);
    }
    public transform(transformation: Transformation): Area{
        const transformedVertices: Point[] = this.vertices.map(p => transformation.apply(p));
        const transformedX: number[] = transformedVertices.map(p => p.x);
        const transformedY: number[] = transformedVertices.map(p => p.y);
        const x: number = Math.min(...transformedX);
        const y: number = Math.min(...transformedY);
        const width: number = Math.max(...transformedX) - x;
        const height: number = Math.max(...transformedY) - y;
        return new Rectangle(x, y, width, height);
    }
    public intersectsRectangle(other: Rectangle): boolean{
        return this.left <= other.right && 
        this.right >= other.left &&
        this.bottom >= other.top &&
        this.top <= other.bottom;
    }
    public intersects(other: Area): boolean{
        return other.intersectsRectangle(this);
    }
    public isContainedByRectangle(other: Rectangle): boolean{
        return other.left <= this.left &&
               other.right >= this.right &&
               other.top <= this.top &&
               other.bottom >= this.bottom;
    }
    public contains(other: Area): boolean{
        return other.isContainedByRectangle(this);
    }
    public static create(area: Point | Rectangle): Rectangle{
        if(isPoint(area)){
            return new Rectangle(area.x, area.y, 0, 0);
        }
        return area;
    }
}