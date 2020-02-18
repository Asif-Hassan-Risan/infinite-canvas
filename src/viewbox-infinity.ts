import { Transformation } from "./transformation";
import { Point } from "./geometry/point";
import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import { Rectangle } from "./areas/polygons/rectangle";

export class ViewBoxInfinity{
    private viewBoxRectangle: ConvexPolygon;
    constructor(private viewBoxWidth: number, private viewBoxHeight: number, private infiniteContextTransformation: Transformation){
        this.viewBoxRectangle = Rectangle.create(0, 0, viewBoxWidth, viewBoxHeight);
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point, viewBoxTransformation: Transformation): Point{
        const transformedViewbox: ConvexPolygon = this.viewBoxRectangle.transform(viewBoxTransformation.inverse().before(this.infiniteContextTransformation.inverse()));
        const intersectionInDirection: Point = ViewBoxInfinity.getIntersectionInDirection(transformedViewbox, fromPoint, direction);
        return viewBoxTransformation.apply(intersectionInDirection);
    }
    private static getIntersectionInDirection(transformedViewbox: ConvexPolygon, fromPoint: Point, direction: Point){
        let pointFurthestAlong: Point = fromPoint;
        let along: number = 0;
        for(let vertex of transformedViewbox.vertices){
            const newAlong: number = vertex.point.minus(fromPoint).dot(direction);
            if(newAlong > along){
                along = newAlong;
                pointFurthestAlong = vertex.point;
            }
        }
        return fromPoint.plus(pointFurthestAlong.minus(fromPoint).projectOn(direction));
    }
}