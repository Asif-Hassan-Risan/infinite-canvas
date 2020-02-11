import { Transformation } from "./transformation";
import { Point } from "./geometry/point";
import { ConvexPolygon } from "./areas/convex-polygon";
import { Rectangle } from "./areas/rectangle";

export class ViewBoxInfinity{
    private viewBoxRectangle: ConvexPolygon;
    constructor(private viewBoxWidth: number, private viewBoxHeight: number, private contextTransformation: Transformation){
        this.viewBoxRectangle = Rectangle.create(0, 0, viewBoxWidth, viewBoxHeight);
    }
    public getInfinityFromPointInDirection(fromPoint: Point, direction: Point, viewBoxTransformation: Transformation): Point{
        const transformedViewbox: ConvexPolygon = this.viewBoxRectangle.transform(viewBoxTransformation.inverse().before(this.contextTransformation.inverse()).before(viewBoxTransformation));
        return undefined;
    }
}