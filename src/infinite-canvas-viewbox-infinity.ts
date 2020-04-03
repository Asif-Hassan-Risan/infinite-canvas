import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Point} from "./geometry/point";
import {Transformation} from "./transformation";
import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import {transformation} from "./state/dimensions/transformation";

export class InfiniteCanvasViewboxInfinity implements ViewboxInfinity{
    constructor(private readonly getTransformedViewbox: () => ConvexPolygon, private readonly getViewBoxTransformation: () => Transformation, private readonly getLineDashPeriod: () => number) {
    }
    public moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void{
        const pointInFront: Point = this.getTransformedViewbox().getPointInFrontInDirection(fromPoint, direction);
        this.moveToTransformed(context, pointInFront, this.getViewBoxTransformation());
    }
    public drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, point: Point, fromDirection: Point, toDirection: Point): void{
        const viewBoxTransformation: Transformation = this.getViewBoxTransformation();
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const startingPoint: Point = transformedViewbox.getPointInFrontInDirection(point, fromDirection);
        const destinationPoint: Point = transformedViewbox.getPointInFrontInDirection(point, toDirection);
        let polygonToCircumscribe: ConvexPolygon = transformedViewbox
            .expandToIncludePoint(point)
            .expandToIncludePoint(startingPoint)
            .expandToIncludePoint(destinationPoint);
        const verticesInBetween: Point[] = polygonToCircumscribe.vertices.map(v => v.point).filter(p => !p.equals(startingPoint) && !p.equals(destinationPoint) && !p.equals(point) && p.minus(point).isInSmallerAngleBetweenPoints(fromDirection, toDirection));
        verticesInBetween.sort((p1, p2) => {
            if(p1.minus(point).isInSmallerAngleBetweenPoints(p2.minus(point), fromDirection)){
                return -1;
            }
            return 1;
        });
        let currentPoint: Point = startingPoint;
        let distanceCovered: number = 0;
        for(let vertexInBetween of verticesInBetween){
            distanceCovered += vertexInBetween.minus(currentPoint).mod();
            this.lineToTransformed(context, vertexInBetween, viewBoxTransformation);
            currentPoint = vertexInBetween;
        }
        distanceCovered += destinationPoint.minus(currentPoint).mod();
        this.lineToTransformed(context, destinationPoint, viewBoxTransformation);
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewBoxTransformation, distanceCovered, destinationPoint, toDirection);
    }
    public drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, point1: Point, point2: Point, direction: Point): void{
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const viewboxTransformation: Transformation = this.getViewBoxTransformation();
        const fromPoint: Point = transformedViewbox.getPointInFrontInDirection(point1, direction);
        const toPoint: Point = transformedViewbox.getPointInFrontInDirection(point2, direction);
        this.lineToTransformed(context, toPoint, viewboxTransformation);
        const distanceCovered: number = toPoint.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewboxTransformation, distanceCovered, toPoint, direction);
    }
    public drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, point: Point, direction: Point): void{
        const viewboxTransformation: Transformation = this.getViewBoxTransformation();
        const fromPoint: Point = this.getTransformedViewbox().getPointInFrontInDirection(point, direction);
        const distanceToCover: number = point.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewboxTransformation, distanceToCover, fromPoint, direction);
        this.lineToTransformed(context, point, viewboxTransformation);
    }
    public drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void{
        const viewboxTransformation: Transformation = this.getViewBoxTransformation();
        const toPoint: Point = this.getTransformedViewbox().getPointInFrontInDirection(fromPoint, direction);
        this.lineToTransformed(context, toPoint, viewboxTransformation);
        const distanceCovered: number = toPoint.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewboxTransformation, distanceCovered, toPoint, direction);
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point{
        return this.getViewBoxTransformation().apply(this.getUntransformedInfinityFromPointInDirection(fromPoint, direction, this.getTransformedViewbox(), this.getLineDashPeriod()));
    }
    private ensureDistanceCoveredIsMultipleOfLineDashPeriod(context: CanvasRenderingContext2D, viewboxTransformation: Transformation, distanceSoFar: number, lastPoint: Point, directionOfExtraPoint: Point): void{
        const lineDashPeriod: number = this.getLineDashPeriod();
        if(lineDashPeriod === 0){
            return;
        }
        const distanceLeft: number = this.getDistanceLeft(distanceSoFar, lineDashPeriod);
        if(distanceLeft === 0){
            return;
        }
        const extraPoint: Point = this.getPointInDirectionAtDistance(lastPoint, directionOfExtraPoint, distanceLeft / 2);
        this.lineToTransformed(context, extraPoint, viewboxTransformation);
        this.lineToTransformed(context, lastPoint, viewboxTransformation);
    }
    private lineToTransformed(context: CanvasRenderingContext2D, point: Point, transformation: Transformation){
        const {x, y} = transformation.apply(point);
        context.lineTo(x, y);
    }
    private moveToTransformed(context: CanvasRenderingContext2D, point: Point, transformation: Transformation){
        const {x, y} = transformation.apply(point);
        context.moveTo(x, y);
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
