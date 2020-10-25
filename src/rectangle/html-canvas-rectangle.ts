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
import { CanvasMeasurement } from "./canvas-measurement";
import { RectangleMeasurement } from "./rectangle-measurement";
import { RectangleTransformations } from "./transformations/rectangle-transformations";
import { RectangleTransformationsForCSSUnits } from "./transformations/rectangle-transformations-for-css-units";
import { RectangleTransformationsForCanvasUnits } from "./transformations/rectangle-transformations-for-canvas-units";

function createRectangleMeasurement(canvasMeasurement: CanvasMeasurement): RectangleMeasurement{
    const {viewboxWidth, viewboxHeight, screenWidth, screenHeight} = canvasMeasurement;
    const polygon: ConvexPolygon = ConvexPolygon.createRectangle(0, 0, viewboxWidth, viewboxHeight);
    const screenTransformation: Transformation = new Transformation(screenWidth / viewboxWidth, 0, 0, screenHeight / viewboxHeight, 0, 0);
    return {screenWidth, screenHeight, viewboxWidth, viewboxHeight, polygon, screenTransformation};
}

function convertToRectangleTransformationsForCanvasUnits(transformations: RectangleTransformationsForCSSUnits): RectangleTransformationsForCanvasUnits{
    return new RectangleTransformationsForCanvasUnits(
        transformations.transformation,
        transformations.inverseTransformation,
        transformations.screenTransformation,
        transformations.inverseScreenTransformation,
        transformations.screenTransformation,
        transformations.initialContextTransformation
    )
}

function convertToRectangleTransformationsForCSSUnits(transformations: RectangleTransformationsForCanvasUnits): RectangleTransformationsForCSSUnits{
    return new RectangleTransformationsForCSSUnits(
        transformations.transformation,
        transformations.inverseTransformation,
        transformations.screenTransformation,
        transformations.inverseScreenTransformation,
        transformations.initialContextTransformation
    );
}

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    public polygon: ConvexPolygon;
    private unitsUsed: InfiniteCanvasUnits;
    private screenWidth: number;
    private screenHeight: number;
    public get initialContextTransformation(): Transformation{return this.transformations.initialContextTransformation;}
    private transformations: RectangleTransformations;
    public get transformation(): Transformation{return this.transformations.transformation;}
    public set transformation(value: Transformation){
        this.transformations = this.transformations.setTransformation(value);
    }
    constructor(private readonly measurementProvider: CanvasMeasurementProvider, private readonly config: InfiniteCanvasConfig) {
        this.unitsUsed = config.units === InfiniteCanvasUnits.CSS ? InfiniteCanvasUnits.CSS : InfiniteCanvasUnits.CANVAS;
        const measurement: RectangleMeasurement = createRectangleMeasurement(this.measurementProvider.measure());
        this.addMeasurement(measurement);
        this.transformations = config.units === InfiniteCanvasUnits.CSS ? 
            RectangleTransformationsForCSSUnits.create(measurement) :
            RectangleTransformationsForCanvasUnits.create(measurement);
    }
    private isChange(measurement: CanvasMeasurement): boolean{
        return measurement.viewboxWidth !== this.viewboxWidth ||
            measurement.viewboxHeight !== this.viewboxHeight ||
            measurement.screenWidth !== this.screenWidth ||
            measurement.screenHeight !== this.screenHeight;
    }
    private addMeasurement(measurement: RectangleMeasurement): void{
        this.viewboxWidth = measurement.viewboxWidth;
        this.viewboxHeight = measurement.viewboxHeight;
        this.screenWidth = measurement.screenWidth;
        this.screenHeight = measurement.screenHeight;
        this.polygon = measurement.polygon;
    }
    public measure(): void{
        const newUnitsToUse: InfiniteCanvasUnits = this.config.units === InfiniteCanvasUnits.CSS ? InfiniteCanvasUnits.CSS : InfiniteCanvasUnits.CANVAS;
        if(newUnitsToUse === InfiniteCanvasUnits.CANVAS && this.unitsUsed === InfiniteCanvasUnits.CSS){
            this.transformations = convertToRectangleTransformationsForCanvasUnits(this.transformations as RectangleTransformationsForCSSUnits);
        }
        if(newUnitsToUse === InfiniteCanvasUnits.CSS && this.unitsUsed === InfiniteCanvasUnits.CANVAS){
            this.transformations = convertToRectangleTransformationsForCSSUnits(this.transformations as RectangleTransformationsForCanvasUnits);
        }
        this.unitsUsed = newUnitsToUse;
        const newMeasurement: CanvasMeasurement = this.measurementProvider.measure();
        if(!this.isChange(newMeasurement)){
            return;
        }
        const newRectangleMeasurement: RectangleMeasurement = createRectangleMeasurement(newMeasurement);
        this.addMeasurement(newRectangleMeasurement);
        this.transformations = this.transformations.setScreenTransformation(newRectangleMeasurement.screenTransformation);
    }

    public getTransformationInstruction(toTransformation: Transformation): Instruction{
        return (context: CanvasRenderingContext2D) => {
            const {a, b, c, d, e, f} = this.transformations.inverseTransformation.before(toTransformation).before(this.transformations.transformation).before(this.transformations.initialContextTransformation);
            context.setTransform(a, b, c, d, e, f);
        }
    }
    public getCSSPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.measurementProvider.measure();
        return new Point(clientX - left, clientY - top);
    }
    public getCanvasContextPosition(clientX: number, clientY: number): Point{
        const cssPosition: Point = this.getCSSPosition(clientX, clientY);
        const t: Transformation = this.inverseScreenTransformation.before(this.transformation.inverse()).before(this.initialTransformation.inverse());
        return t.apply(cssPosition);
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
    public getViewboxTransformer(state: InfiniteCanvasState): ViewboxTransformer{
        return new CanvasViewboxTransformer(state, this);
    }
    public applyInitialTransformation(context: CanvasRenderingContext2D): void{
        const transformationToApply: Transformation = this.transformations.initialContextTransformation;
        if(transformationToApply.equals(Transformation.identity)){
            return;
        }
        const {a, b, c, d, e, f} = transformationToApply;
        context.setTransform(a, b, c, d, e, f);
    }
}
