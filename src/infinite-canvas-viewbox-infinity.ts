import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Point} from "./geometry/point";
import {Transformation} from "./transformation";
import {ConvexPolygon} from "./areas/polygons/convex-polygon";

export class InfiniteCanvasViewboxInfinity implements ViewboxInfinity{
    constructor(private readonly getTransformedViewbox: () => ConvexPolygon, private readonly getViewBoxTransformation: () => Transformation) {
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point{
        const pointInFront: Point = this.getTransformedViewbox().getPointInFrontInDirection(fromPoint, direction);
        return this.getViewBoxTransformation().apply(pointInFront);
    }
    public getInfinitiesFromDirectionFromPointToDirection(point: Point, direction1: Point, direction2: Point): Point[]{
        const viewBoxTransformation: Transformation = this.getViewBoxTransformation();
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const startingPoint: Point = transformedViewbox.getPointInFrontInDirection(point, direction1);
        const destinationPoint: Point = transformedViewbox.getPointInFrontInDirection(point, direction2);
        let polygonToCircumscribe: ConvexPolygon = transformedViewbox
            .expandToIncludePoint(point)
            .expandToIncludePoint(startingPoint)
            .expandToIncludePoint(destinationPoint);
        const verticesInBetween: Point[] = polygonToCircumscribe.vertices.map(v => v.point).filter(p => !p.equals(startingPoint) && !p.equals(destinationPoint) && !p.equals(point) && p.minus(point).isInSmallerAngleBetweenPoints(direction1, direction2));
        verticesInBetween.sort((p1, p2) => {
            if(p1.minus(point).isInSmallerAngleBetweenPoints(p2.minus(point), direction1)){
                return -1;
            }
            return 1;
        });
        return verticesInBetween.concat([destinationPoint]).map(p => viewBoxTransformation.apply(p));
    }
}