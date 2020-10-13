import {ConvexPolygon} from "../areas/polygons/convex-polygon";
import {Point} from "../geometry/point";
import {CanvasRectangle} from "./canvas-rectangle";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Transformation} from "../transformation";
import {CanvasMeasurementProvider} from "./canvas-measurement-provider";
import {PathInfinityProvider} from "../interfaces/path-infinity-provider";
import {InfiniteCanvasPathInfinityProvider} from "../infinite-canvas-path-infinity-provider";
import {CanvasViewboxTransformer} from "./canvas-viewbox-transformer";
import {ViewboxTransformer} from "./viewbox-transformer";
import {Instruction} from "../instructions/instruction";
import {InfiniteCanvasConfig} from "../config/infinite-canvas-config";
import {InfiniteCanvasUnits} from "../infinite-canvas-units";

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    public polygon: ConvexPolygon;
    private unitsUsed: InfiniteCanvasUnits;
    private screenWidth: number;
    private screenHeight: number;
    private _transformation: Transformation;
    private screenTransformation: Transformation;
    private cumulativeScreenTransformation: Transformation;
    private inverseScreenTransformation: Transformation;
    public initialTransformation: Transformation;
    public get transformation(): Transformation{return this._transformation;}
    public set transformation(value: Transformation){
        this._transformation = value;
        this.setInitialTransformation();
    }
    constructor(private readonly measurementProvider: CanvasMeasurementProvider, private readonly config: InfiniteCanvasConfig) {
        this.unitsUsed = config.units === InfiniteCanvasUnits.CSS ? InfiniteCanvasUnits.CSS : InfiniteCanvasUnits.CANVAS;
        this.measure();
        this.transformation = Transformation.identity;
    }
    public setUnits(): void{
        const newUnitsToUse: InfiniteCanvasUnits = this.config.units === InfiniteCanvasUnits.CSS ? InfiniteCanvasUnits.CSS : InfiniteCanvasUnits.CANVAS;
        if(newUnitsToUse === InfiniteCanvasUnits.CANVAS && this.unitsUsed !== InfiniteCanvasUnits.CANVAS){
            this.cumulativeScreenTransformation = this.screenTransformation;
        }
        this.unitsUsed = newUnitsToUse;
        this.measure();
        this.setInitialTransformation();
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
        const newScreenTransformation: Transformation = new Transformation(this.screenWidth / this.viewboxWidth, 0, 0, this.screenHeight / this.viewboxHeight, 0, 0);
        if(this.unitsUsed === InfiniteCanvasUnits.CANVAS){
            this.cumulativeScreenTransformation = this.getNewCumulativeScreenTransformation(newScreenTransformation);
        }
        this.screenTransformation = newScreenTransformation;
        this.inverseScreenTransformation = this.screenTransformation.inverse();
        this.polygon = ConvexPolygon.createRectangle(0, 0, this.viewboxWidth, this.viewboxHeight);
    }
    private setInitialTransformation(): void{
        if(this.unitsUsed === InfiniteCanvasUnits.CANVAS){
            this.initialTransformation = this.cumulativeScreenTransformation.before(this.transformation).before(this.inverseScreenTransformation).before(this.transformation.inverse())
        }else{
            this.initialTransformation = this.transformation.before(this.inverseScreenTransformation).before(this.transformation.inverse());
        }
    }
    private getNewCumulativeScreenTransformation(newScreenTransformation: Transformation): Transformation{
        if(this.screenTransformation){
            return this.cumulativeScreenTransformation.before(this.transformation).before(this.inverseScreenTransformation).before(newScreenTransformation).before(this.transformation.inverse());
        }else{
            return newScreenTransformation;
        }
    }
    public getTransformationInstruction(toTransformation: Transformation): Instruction{
        return (context: CanvasRenderingContext2D) => {
            const {a, b, c, d, e, f} = this.transformation.inverse().before(toTransformation).before(this.initialTransformation).before(this.transformation);
            context.setTransform(a, b, c, d, e, f);
        }
    }
    public getViewboxPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.measurementProvider.measure();
        return new Point(clientX - left, clientY - top);
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
    public getViewboxTransformer(state: InfiniteCanvasState): ViewboxTransformer{
        return new CanvasViewboxTransformer(state, this);
    }
    public applyInitialTransformation(context: CanvasRenderingContext2D): void{
        const transformationToApply: Transformation = this.transformation.inverse().before(this.initialTransformation).before(this.transformation);
        if(transformationToApply.equals(Transformation.identity)){
            return;
        }
        const {a, b, c, d, e, f} = transformationToApply;
        context.setTransform(a, b, c, d, e, f);
    }
}
