import { Transformation } from "./transformation";
import { Point } from "./geometry/point";
import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";

export class InfiniteCanvasViewBoxInfinity implements ViewboxInfinity{
    private viewBoxRectangle: ConvexPolygon;
    constructor(private viewBoxWidth: number, private viewBoxHeight: number, private infiniteContextTransformation: Transformation){
        this.viewBoxRectangle = ConvexPolygon.createRectangle(0, 0, viewBoxWidth, viewBoxHeight);
    }
    private getTransformedViewbox(viewBoxTransformation: Transformation): ConvexPolygon{
        const contextTransformation: Transformation = viewBoxTransformation.inverse().before(this.infiniteContextTransformation).before(viewBoxTransformation);
        const t: Transformation = viewBoxTransformation.before(contextTransformation);
        return this.viewBoxRectangle.transform(t.inverse());
    }
    public getInfinitiesFromDirectionFromPointToDirection(point: Point, direction1: Point, direction2: Point, viewBoxTransformation: Transformation): Point[]{
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox(viewBoxTransformation);
        const startingPoint: Point = transformedViewbox.getPointInFrontInDirection(point, direction1);
        const destinationPoint: Point = transformedViewbox.getPointInFrontInDirection(point, direction2);
        let polygonToCircumscribe: ConvexPolygon = transformedViewbox.expandToIncludePoint(startingPoint).expandToIncludePoint(destinationPoint);
        const verticesInBetween: Point[] = polygonToCircumscribe.getVerticesBetweenPointsInDirection(startingPoint, destinationPoint, direction1, direction2);
        return verticesInBetween.concat([destinationPoint]).map(p => viewBoxTransformation.apply(p));
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point, viewBoxTransformation: Transformation): Point{
        const pointInFront: Point = this.getTransformedViewbox(viewBoxTransformation).getPointInFrontInDirection(fromPoint, direction);
        return viewBoxTransformation.apply(pointInFront);
    }
}
