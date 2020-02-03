import { Area } from "./area";
import { HalfPlane } from "./half-plane";

export class ConvexPolygon implements Area{
    constructor(private readonly halfPlanes: HalfPlane[]){}
}