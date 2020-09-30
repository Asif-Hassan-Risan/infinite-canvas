import { ConvexPolygon } from "../src/areas/polygons/convex-polygon";
import { Point } from "../src/geometry/point";
import {CanvasRectangle} from "../src/interfaces/canvas-rectangle";

export class MockCanvasRectangle implements CanvasRectangle{
    public polygon: ConvexPolygon;
    constructor(public viewboxWidth: number, public viewboxHeight: number) {
        this.polygon = ConvexPolygon.createRectangle(0, 0, this.viewboxWidth, this.viewboxHeight);
    }
    public measure(): void{}
    public getViewboxPosition(screenX: number, screenY: number): Point{
        return new Point(screenX, screenY);
    }
}
