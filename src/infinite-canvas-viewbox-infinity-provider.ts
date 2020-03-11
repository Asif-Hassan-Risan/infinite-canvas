import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Transformation} from "./transformation";
import {InfiniteCanvasViewboxInfinity} from "./infinite-canvas-viewbox-infinity";
import {ViewboxInfinityProvider} from "./interfaces/viewbox-infinity-provider";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";

export class InfiniteCanvasViewboxInfinityProvider implements ViewboxInfinityProvider{
    private viewBoxRectangle: ConvexPolygon;
    public viewBoxTransformation: Transformation = Transformation.identity;
    private maxDrawnLineWidth: number = 0;
    constructor(private readonly viewBoxWidth: number, private readonly viewBoxHeight: number) {
        this.viewBoxRectangle = ConvexPolygon.createRectangle(0, 0, viewBoxWidth, viewBoxHeight);
    }
    public addDrawnLineWidth(lineWidth: number): void{
        if(lineWidth > this.maxDrawnLineWidth){
            this.maxDrawnLineWidth = lineWidth;
        }
    }
    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity{
        const infiniteContextTransformation: Transformation = state.current.transformation;
        const getTransformedViewbox: () => ConvexPolygon = () => {
            const t: Transformation = infiniteContextTransformation.before(this.viewBoxTransformation)
            return this.viewBoxRectangle.expandByDistance(this.maxDrawnLineWidth * this.viewBoxTransformation.scale).transform(t.inverse());
        };
        return new InfiniteCanvasViewboxInfinity(getTransformedViewbox, () => this.viewBoxTransformation);
    }
}