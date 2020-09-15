import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import {Transformation} from "./transformation";
import {ViewboxInfinityProvider} from "./interfaces/viewbox-infinity-provider";
import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasPathInfinityProvider } from "./infinite-canvas-path-infinity-provider";
import {CanvasRectangle} from "./interfaces/canvas-rectangle";

export class InfiniteCanvasViewboxInfinityProvider implements ViewboxInfinityProvider{
    public viewBoxRectangle: ConvexPolygon;
    public viewBoxTransformation: Transformation = Transformation.identity;
    public get viewBoxWidth(): number{return this.canvasRectangle.pixelWidth}
    public get viewBoxHeight(): number{return this.canvasRectangle.pixelHeight}
    constructor(private readonly canvasRectangle: CanvasRectangle) {
        this.viewBoxRectangle = ConvexPolygon.createRectangle(0, 0, this.viewBoxWidth, this.viewBoxHeight);
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
}
