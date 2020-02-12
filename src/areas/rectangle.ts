import { Point } from "../geometry/point";
import { HalfPlane } from "./half-plane";
import { ConvexPolygon } from "./convex-polygon";

export class Rectangle extends ConvexPolygon{
    constructor(left: HalfPlane, top: HalfPlane, right: HalfPlane, bottom: HalfPlane){
        super([left, top, right, bottom]);
    }
    public static create(x: number, y: number, width: number, height: number): Rectangle{
        const left: HalfPlane = new HalfPlane(new Point(x, y), new Point(1, 0));
        const top: HalfPlane = new HalfPlane(new Point(x, y), new Point(0, 1));
        const right: HalfPlane = new HalfPlane(new Point(x + width, y + height), new Point(-1, 0));
        const bottom: HalfPlane = new HalfPlane(new Point(x + width, y + height), new Point(0, -1));
        return new Rectangle(left, top, right, bottom);
    }
    public static createBetweenPoints(point1: Point, point2: Point){
        const x: number = Math.min(point1.x, point2.x);
        const y: number = Math.min(point1.y, point2.y);
        const width: number = Math.abs(point1.x - point2.x);
        const height: number = Math.abs(point1.y - point2.y);
        return Rectangle.create(x, y, width, height);
    }
}
