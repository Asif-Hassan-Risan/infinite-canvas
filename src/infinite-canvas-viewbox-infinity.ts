import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Point} from "./geometry/point";
import {Transformation} from "./transformation";
import {ConvexPolygon} from "./areas/polygons/convex-polygon";

export class InfiniteCanvasViewboxInfinity implements ViewboxInfinity{
    constructor(private readonly getTransformedViewbox: () => ConvexPolygon, private readonly getViewBoxTransformation: () => Transformation, private readonly getLineDashPeriod: () => number) {
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point{
        return this.getViewBoxTransformation().apply(this.getUntransformedInfinityFromPointInDirection(fromPoint, direction, this.getTransformedViewbox(), this.getLineDashPeriod()));
    }
    private getUntransformedInfinityFromPointInDirection(fromPoint: Point, direction: Point, transformedViewbox: ConvexPolygon, lineDashPeriod: number): Point{
        let pointInFront: Point = transformedViewbox.getPointInFrontInDirection(fromPoint, direction);
        return this.getEndOfLineDashPeriod(fromPoint, pointInFront, lineDashPeriod);
    }
    private getDistanceCovered(fromPoint: Point, toPoints: Point[]): number{
        let result: number = 0;
        let mostRecentPoint: Point = fromPoint;
        for(let toPoint of toPoints){
            result += toPoint.minus(mostRecentPoint).mod();
            mostRecentPoint = toPoint;
        }
        return result;
    }
    private getDistanceLeft(distanceSoFar: number, period: number): number{
        if(period === 0){
            return 0;
        }
        const nrOfPeriods: number = (distanceSoFar / period) | 0;
        return distanceSoFar - period * nrOfPeriods === 0 ? 0 : (nrOfPeriods + 1) * period - distanceSoFar;
    }
    private getPointInDirectionAtDistance(point: Point, direction: Point, distance: number): Point{
        return point.plus(direction.scale(distance / direction.mod()));
    }
    private getEndOfLineDashPeriod(fromPoint: Point, toPoint: Point, period: number){
        const difference: Point = toPoint.minus(fromPoint);
        const distanceLeft: number = this.getDistanceLeft(difference.mod(), period);
        if(distanceLeft === 0){
            return toPoint;
        }
        return this.getPointInDirectionAtDistance(toPoint, difference, distanceLeft);
    }
    public getInfinitiesFromDirectionFromPointToDirection(point: Point, direction1: Point, direction2: Point): Point[]{
        const viewBoxTransformation: Transformation = this.getViewBoxTransformation();
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const lineDashPeriod: number = this.getLineDashPeriod();
        const startingPoint: Point = this.getUntransformedInfinityFromPointInDirection(point, direction1, transformedViewbox, lineDashPeriod);
        const destinationPoint: Point = this.getUntransformedInfinityFromPointInDirection(point, direction2, transformedViewbox, lineDashPeriod);
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
        const result: Point[] = verticesInBetween.concat([destinationPoint]);
        if(lineDashPeriod !== 0){
            const distanceCovered: number = this.getDistanceCovered(startingPoint, result);
            const distanceLeft: number = this.getDistanceLeft(distanceCovered, lineDashPeriod);
            const extraPoint: Point = this.getPointInDirectionAtDistance(destinationPoint, direction2, distanceLeft/2);
            result.push(extraPoint, destinationPoint);
        }
        return result.map(p => viewBoxTransformation.apply(p));
    }
}
