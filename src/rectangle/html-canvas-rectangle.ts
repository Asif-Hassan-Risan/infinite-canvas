import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";
import {CanvasRectangle} from "./canvas-rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Transformation } from "../transformation";
import { CanvasMeasurementProvider } from "./canvas-measurement-provider";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";
import { CanvasViewboxTransformer } from "./canvas-viewbox-transformer";
import { ViewboxTransformer } from "./viewbox-transformer";
import { Instruction } from "../instructions/instruction";

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    public polygon: ConvexPolygon;
    private screenWidth: number;
    private screenHeight: number;
    private measuredOnce: boolean = false;
    private screenTransformation: Transformation;
    private inverseScreenTransformation: Transformation;
    public transformation: Transformation;
    constructor(private readonly measurementProvider: CanvasMeasurementProvider) {
        this.transformation = Transformation.identity;
        this.measure();
    }
    public measure(): void{
        const {viewboxWidth, viewboxHeight, screenWidth, screenHeight} = this.measurementProvider.measure();
        if(viewboxWidth === this.viewboxWidth &&
            viewboxHeight === this.viewboxHeight &&
            screenWidth === this.screenWidth &&
            screenHeight === this.screenHeight){
                return;
        }
        this.viewboxWidth = viewboxWidth;
        this.viewboxHeight = viewboxHeight;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.screenTransformation = new Transformation(this.screenWidth / this.viewboxWidth, 0, 0, this.screenHeight / this.viewboxHeight, 0, 0);
        this.inverseScreenTransformation = this.screenTransformation.inverse();
        this.polygon = ConvexPolygon.createRectangle(0, 0, this.viewboxWidth, this.viewboxHeight);
        this.measuredOnce = true;
    }
    public getTransformationInstruction(toTransformation: Transformation): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {a, b, c, d, e, f} = transformation.inverse().before(toTransformation).before(transformation);
            context.setTransform(a, b, c, d, e, f);
        }
    }
    public getViewboxPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.measurementProvider.measure();
        return this.inverseScreenTransformation.apply(new Point(clientX - left, clientY - top));
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
    public getViewboxTransformer(state: InfiniteCanvasState): ViewboxTransformer{
        return new CanvasViewboxTransformer(state, this);
    }
}
