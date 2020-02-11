import { Transformation } from "./transformation";
import { Point } from "./geometry/point";
import { ConvexPolygon } from "./areas/convex-polygon";
import { Rectangle } from "./areas/rectangle";

export class ViewBoxInfinity{
    private viewBoxRectangle: ConvexPolygon;
    constructor(private viewBoxWidth: number, private viewBoxHeight: number, private infiniteContextTransformation: Transformation){
        this.viewBoxRectangle = Rectangle.create(0, 0, viewBoxWidth, viewBoxHeight);
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point, viewBoxTransformation: Transformation): Point{
        const transformedViewbox: ConvexPolygon = this.viewBoxRectangle.transform(viewBoxTransformation.inverse().before(this.infiniteContextTransformation.inverse()));
        const containingRectangle: ConvexPolygon = ViewBoxInfinity.getContainingRectangle(transformedViewbox);
        const intersectionInDirection: Point = ViewBoxInfinity.getIntersectionInDirection(containingRectangle, fromPoint, direction);
        return viewBoxTransformation.apply(intersectionInDirection);
    }
    private static getIntersectionInDirection(containingRectangle: ConvexPolygon, fromPoint: Point, direction: Point){
        const intersections: Point[] = containingRectangle.intersectWithLine(fromPoint, direction);
        return ViewBoxInfinity.getPointFurthestInDirection(fromPoint, direction, intersections);
    }
    private static getContainingRectangle(polygon: ConvexPolygon): ConvexPolygon{
        const verticesX: number[] = polygon.vertices.map(v => v.point.x);
        const verticesY: number[] = polygon.vertices.map(v => v.point.y);
        const left: number = Math.min.apply(null, verticesX);
        const right:number = Math.max.apply(null, verticesX);
        const top: number = Math.min.apply(null, verticesY);
        const bottom: number = Math.max.apply(null, verticesY);
        return Rectangle.create(left, top, right - left, bottom - top);
    }
    private static getPointFurthestInDirection(fromPoint: Point, direction: Point, points: Point[]): Point{
        let result: Point = fromPoint;
        let along: number = 0;
        for(let candidate of points){
            const newAlong: number = candidate.minus(fromPoint).dot(direction);
            if(newAlong >= along){
                along = newAlong;
                result = candidate;
            }
        }
        return result;
    }
}