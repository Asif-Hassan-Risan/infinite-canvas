import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { Rectangle } from "../areas/polygons/rectangle";
import { AreaChange } from "../areas/area-change";
import { Point } from "../geometry/point";
import { PathInstruction } from "../interfaces/path-instruction";
import { AreaBuilder } from "../areas/area-builder";
import { Area } from "../areas/area";

export class PathInstructions{

    public static arc(_x: number, _y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction{
        const instruction: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const transformationAngle: number = transformation.getRotationAngle();
            const {x, y} = transformation.apply(new Point(_x, _y));
            context.arc(x, y, radius * transformation.scale, startAngle + transformationAngle, endAngle + transformationAngle, anticlockwise);
        };
        const changeArea: AreaChange = (builder: AreaBuilder) => builder.addArea(Rectangle.create(_x - radius, _y - radius, 2 * radius, 2 * radius));
        return {
            instruction: instruction,
            changeArea: changeArea
        };
    }

    public static arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): PathInstruction{
        const p1: Point = new Point(x1, y1);
        const p2: Point = new Point(x2, y2);
        const newRectangle: Rectangle = Rectangle.createBetweenPoints(p1, p2);
        const instruction: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const tp1: Point = transformation.apply(p1);
            const tp2: Point = transformation.apply(p2);
            context.arcTo(tp1.x, tp1.y, tp2.x, tp2.y, radius * transformation.scale);
        };
        const changeArea: AreaChange = (builder: AreaBuilder) => builder.addArea(newRectangle);
        return {
            instruction: instruction,
            changeArea: changeArea
        };
    }

    public static bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PathInstruction{
        return undefined;
    }

    public static closePath(): PathInstruction{
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.closePath();
            },
            changeArea: () => {}
        };
    }

    public static ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction{
        const newRectangle: Area = Rectangle.create(x - radiusX, y - radiusY, 2 * radiusX, 2 * radiusY).transform(Transformation.rotation(x, y, rotation));
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const tCenter: Point = transformation.apply(new Point(x, y));
                const transformationAngle: number = transformation.getRotationAngle();
                context.ellipse(tCenter.x, tCenter.y, radiusX * transformation.scale, radiusY * transformation.scale, rotation + transformationAngle, startAngle, endAngle, anticlockwise);
            },
            changeArea: (builder: AreaBuilder) => builder.addArea(newRectangle)
        };
    }

    public static lineTo(_x: number, _y: number): PathInstruction{
        const point: Point = new Point(_x, _y);
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {x, y} = transformation.apply(point);
                context.lineTo(x, y);
            },
            changeArea: (builder: AreaBuilder) => builder.addPoint(point)
        };
    }

    public static drawRect(x: number, y: number, w: number, h: number): PathInstruction[]{
        return [
            PathInstructions.moveTo(x, y),
            PathInstructions.lineTo(x + w, y),
            PathInstructions.lineTo(x + w, y + h),
            PathInstructions.lineTo(x, y + h),
            PathInstructions.lineTo(x, y)
        ];
    }

    public static moveTo(_x: number, _y: number): PathInstruction{
        const point: Point = new Point(_x, _y);
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {x, y} = transformation.apply(point);
                context.moveTo(x, y);
            },
            changeArea: (builder: AreaBuilder) => builder.addPoint(point)
        };
    }

    public static quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PathInstruction{
        return undefined;
    }
}
