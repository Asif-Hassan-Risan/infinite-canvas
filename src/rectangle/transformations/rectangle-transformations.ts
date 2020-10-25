import { Transformation } from "../../transformation";

export interface RectangleTransformations{
    transformation: Transformation;
    inverseTransformation: Transformation;
    initialContextTransformation: Transformation;
    setTransformation(transformation: Transformation): RectangleTransformations;
    setScreenTransformation(screenTransformation: Transformation): RectangleTransformations;
}