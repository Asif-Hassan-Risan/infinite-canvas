import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import {Transformation} from "./transformation";
import {ViewboxInfinityProvider} from "./interfaces/viewbox-infinity-provider";
import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasPathInfinityProvider } from "./infinite-canvas-path-infinity-provider";
import {CanvasRectangle} from "./interfaces/canvas-rectangle";

export class InfiniteCanvasViewboxInfinityProvider implements ViewboxInfinityProvider{
    public get viewBoxRectangle(): ConvexPolygon{return this.canvasRectangle.polygon;}
    public viewBoxTransformation: Transformation = Transformation.identity;
    public get viewBoxWidth(): number{return this.canvasRectangle.viewboxWidth}
    public get viewBoxHeight(): number{return this.canvasRectangle.viewboxHeight}
    constructor(private readonly canvasRectangle: CanvasRectangle) {
        
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
}
