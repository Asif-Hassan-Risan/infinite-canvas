import { Point } from "./point";
import { Transformation } from "./transformation";
import { isPoint } from "./is-point";
import { PathInstructions } from "./instructions/path-instructions";
import { PathInstruction } from "./interfaces/path-instruction";
import { Area } from "./interfaces/area";

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
    public expandToIncludeRectangle(rectangle: Rectangle): Area{
        const left: number = Math.min(rectangle.left, this.left);
        const right: number = Math.max(rectangle.right, this.right);
        const top: number = Math.min(rectangle.top, this.top);
        const bottom: number = Math.max(rectangle.bottom, this.bottom);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    public expandToInclude(pointOrRectangle: Point | Area): Area{
        if(isPoint(pointOrRectangle)){
            const left: number = Math.min(pointOrRectangle.x, this.left);
            const right: number = Math.max(pointOrRectangle.x, this.right);
            const top: number = Math.min(pointOrRectangle.y, this.top);
            const bottom: number = Math.max(pointOrRectangle.y, this.bottom);
            return new Rectangle(left, top, right - left, bottom - top);
        }else{
            return pointOrRectangle.expandToIncludeRectangle(this);
        }
        
    }
    public getInstructionToClear(): PathInstruction{
        const x: number = this.left;
        const y: number = this.top;
        const width: number = this.right - this.left;
        const height: number = this.bottom - this.top;
        return PathInstructions.clearRect(x, y, width, height);
    }
    public intersectWithRectangle(rectangle: Rectangle): Area{
        if(this.contains(rectangle)){
            return rectangle;
        }
        if(rectangle.contains(this)){
            return this;
        }
        if(!this.intersects(rectangle)){
            return undefined;
        }
        const newTop: number = Math.max(this.top, rectangle.top);
        const newBottom: number = Math.min(this.bottom, rectangle.bottom);
        const newLeft: number = Math.max(this.left, rectangle.left);
        const newRight: number = Math.min(this.right, rectangle.right);
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
    public intersectsRectangle(rectangle: Rectangle): boolean{
        return this.left <= rectangle.right && 
        this.right >= rectangle.left &&
        this.bottom >= rectangle.top &&
        this.top <= rectangle.bottom;
    }
    public intersects(other: Area): boolean{
        return other.intersectsRectangle(this);
    }
    public containsPoint(point: Point): boolean{
        return this.top <= point.y && this.bottom >= point.y && this.left <= point.x && this.right >= point.x;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean{
        return rectangle.left <= this.left &&
               rectangle.right >= this.right &&
               rectangle.top <= this.top &&
               rectangle.bottom >= this.bottom;
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