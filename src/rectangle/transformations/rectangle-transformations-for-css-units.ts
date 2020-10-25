import { Transformation } from "../../transformation";
import { RectangleMeasurement } from "../rectangle-measurement";
import { RectangleTransformations } from "./rectangle-transformations";

export class RectangleTransformationsForCSSUnits implements RectangleTransformations{
    constructor(
        public readonly transformation: Transformation,
        public readonly inverseTransformation: Transformation,
        public readonly screenTransformation: Transformation,
        public readonly inverseScreenTransformation: Transformation,
        public readonly initialContextTransformation: Transformation
    ){

    }
    public setTransformation(transformation: Transformation): RectangleTransformationsForCSSUnits{
        const inverse: Transformation = transformation.inverse();
        return new RectangleTransformationsForCSSUnits(
            transformation,
            inverse,
            this.screenTransformation,
            this.inverseScreenTransformation,
            this.initialContextTransformation
        );
    }
    public setScreenTransformation(screenTransformation: Transformation): RectangleTransformationsForCSSUnits{
        const inverseScreenTransformation: Transformation = screenTransformation.inverse();

        return new RectangleTransformationsForCSSUnits(
            this.transformation,
            this.inverseTransformation,
            screenTransformation,
            inverseScreenTransformation,
            inverseScreenTransformation
        );
    }
    public static create(measurement: RectangleMeasurement): RectangleTransformationsForCSSUnits{
        const inverseScreenTransformation: Transformation = measurement.screenTransformation.inverse();
        return new RectangleTransformationsForCSSUnits(
            Transformation.identity,
            Transformation.identity,
            measurement.screenTransformation,
            inverseScreenTransformation,
            inverseScreenTransformation
        );
    }
}