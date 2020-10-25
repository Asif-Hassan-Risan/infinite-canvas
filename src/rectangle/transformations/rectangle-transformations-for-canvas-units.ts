import { Transformation } from "../../transformation";
import { RectangleMeasurement } from "../rectangle-measurement";
import { RectangleTransformations } from "./rectangle-transformations";

export class RectangleTransformationsForCanvasUnits implements RectangleTransformations{
    constructor(
        public readonly transformation: Transformation,
        public readonly inverseTransformation: Transformation,
        public readonly screenTransformation: Transformation,
        public readonly inverseScreenTransformation: Transformation,
        public readonly cumulativeScreenTransformation: Transformation,
        public readonly initialContextTransformation: Transformation
    ){

    }
    public setTransformation(transformation: Transformation): RectangleTransformationsForCanvasUnits{
        const inverse: Transformation = transformation.inverse();
        const initialContextTransformation: Transformation = inverse.before(this.cumulativeScreenTransformation).before(transformation).before(this.inverseScreenTransformation);
        return new RectangleTransformationsForCanvasUnits(
            transformation,
            inverse,
            this.screenTransformation,
            this.inverseScreenTransformation,
            this.cumulativeScreenTransformation,
            initialContextTransformation
        );
    }
    public setScreenTransformation(screenTransformation: Transformation): RectangleTransformationsForCanvasUnits{
        const cumulativeScreenTransformation: Transformation = this.cumulativeScreenTransformation.before(this.transformation).before(this.inverseScreenTransformation).before(screenTransformation).before(this.inverseTransformation);
        const inverseScreenTransformation: Transformation = screenTransformation.inverse();

        return new RectangleTransformationsForCanvasUnits(
            this.transformation,
            this.inverseTransformation,
            screenTransformation,
            inverseScreenTransformation,
            cumulativeScreenTransformation,
            this.initialContextTransformation
        );
    }
    public static create(measurement: RectangleMeasurement): RectangleTransformationsForCanvasUnits{
        return new RectangleTransformationsForCanvasUnits(
            Transformation.identity,
            Transformation.identity,
            measurement.screenTransformation,
            measurement.screenTransformation.inverse(),
            measurement.screenTransformation,
            Transformation.identity);
    }
    
}