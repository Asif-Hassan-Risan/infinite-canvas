import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { Area } from "./area";
import { HalfPlane } from "./half-plane";
import { ConvexPolygon } from "./convex-polygon";

export class Rectangle implements Area{
    private vertices: Point[];
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;
    constructor(x: number, y: number, width: number, height: number){
        this.vertices = [new Point(x, y), new Point(x + width, y), new Point(x + width, y + height), new Point(x, y + height)];
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }
    public expandToIncludePoint(point: Point): Rectangle{
        const left: number = Math.min(point.x, this.left);
        const right: number = Math.max(point.x, this.right);
        const top: number = Math.min(point.y, this.top);
        const bottom: number = Math.max(point.y, this.bottom);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    public expandToIncludeRectangle(rectangle: Rectangle): Rectangle{
        const left: number = Math.min(rectangle.left, this.left);
        const right: number = Math.max(rectangle.right, this.right);
        const top: number = Math.min(rectangle.top, this.top);
        const bottom: number = Math.max(rectangle.bottom, this.bottom);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area{
        return undefined;
    }
    public intersectWithRectangle(other: Rectangle): Area{
        if(this.contains(other)){
            return other;
        }
        if(other.contains(this)){
            return this;
        }
        if(!this.intersectsRectangle(other)){
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
    public transform(transformation: Transformation): Rectangle{
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
    private isContainedByArea(area: Area): boolean{
        for(let vertex of this.vertices){
            if(!area.containsPoint(vertex)){
                return false;
            }
        }
        return true;
    }
    public isContainedByRectangle(other: Rectangle): boolean{
        return this.isContainedByArea(other);
    }
    public containsPoint(point: Point): boolean{
        return this.top <= point.y && this.bottom >= point.y && this.left <= point.x && this.right >= point.x;
    }
    public contains(other: Area): boolean{
        return other.isContainedByRectangle(this);
    }
}
