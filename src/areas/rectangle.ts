import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { HalfPlane } from "./half-plane";
import { ConvexPolygon } from "./convex-polygon";
import { Instruction } from "../instructions/instruction";
import { RectangularPolygon } from "./rectangular-polygon";

export class Rectangle extends ConvexPolygon implements RectangularPolygon{
    private corners: Point[];
    constructor(private left: HalfPlane, private top: HalfPlane, private right: HalfPlane, private bottom: HalfPlane){
        super([left, top, right, bottom]);
        this.corners = [
            left.getIntersectionWith(top),
            top.getIntersectionWith(right),
            right.getIntersectionWith(bottom),
            bottom.getIntersectionWith(left)
        ];
    }
    public getInstructionToDrawPath(): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            let {x, y} = transformation.apply(this.corners[0]);
            context.moveTo(x, y);
            ({x,y} = transformation.apply(this.corners[1]));
            context.lineTo(x,y);
            ({x,y} = transformation.apply(this.corners[2]));
            context.lineTo(x,y);
            ({x,y} = transformation.apply(this.corners[3]));
            context.lineTo(x,y);
            ({x,y} = transformation.apply(this.corners[0]));
            context.lineTo(x,y);
        };
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
