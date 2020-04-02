import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Point} from "./geometry/point";
import {Transformation} from "./transformation";
import {ConvexPolygon} from "./areas/polygons/convex-polygon";

export class InfiniteCanvasViewboxInfinity implements ViewboxInfinity{
    constructor(private readonly getTransformedViewbox: () => ConvexPolygon, private readonly getViewBoxTransformation: () => Transformation, private readonly getLineDashPeriod: () => number) {
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point{
        let pointInFront: Point = this.getTransformedViewbox().getPointInFrontInDirection(fromPoint, direction);
        pointInFront = this.getEndOfLineDashPeriod(fromPoint, pointInFront, this.getLineDashPeriod());
        return this.getViewBoxTransformation().apply(pointInFront);
    }
    private getEndOfLineDashPeriod(fromPoint: Point, toPoint: Point, period: number){
        if(period === 0){
            return toPoint;
        }
        const length: number = toPoint.minus(fromPoint).mod();
        const nrOfPeriods: number = (length / period) | 0;
        const distanceLeft: number = length - period * nrOfPeriods === 0 ? 0 : (nrOfPeriods + 1) * period - length;
        if(distanceLeft === 0){
            return toPoint;
        }
        const direction: Point = toPoint.minus(fromPoint);
        return toPoint.plus(direction.scale(distanceLeft / direction.mod()));
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
