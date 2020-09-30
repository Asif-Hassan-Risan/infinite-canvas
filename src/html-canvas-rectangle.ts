import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import { Point } from "./geometry/point";
import {CanvasRectangle} from "./interfaces/canvas-rectangle";
import { Transformation } from "./transformation";

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    public polygon: ConvexPolygon;
    private screenWidth: number;
    private screenHeight: number;
    private measuredOnce: boolean = false;
    private screenTransformation: Transformation;
    private inverseScreenTransformation: Transformation;
    constructor(private readonly canvasElement: HTMLCanvasElement) {
        this.measure();
    }
    public measure(): void{
        const {width: viewboxWidth, height: viewboxHeight} = this.canvasElement;
        const {width: screenWidth, height: screenHeight} = this.canvasElement.getBoundingClientRect();
        if(viewboxWidth === this.viewboxWidth &&
            viewboxHeight === this.viewboxHeight &&
            screenWidth === this.screenWidth &&
            screenHeight === this.screenHeight){
                return;
        }
        console.log(`viewbox changed`);
        this.viewboxWidth = viewboxWidth;
        this.viewboxHeight = viewboxHeight;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.screenTransformation = new Transformation(this.screenWidth / this.viewboxWidth, 0, 0, this.screenHeight / this.viewboxHeight, 0, 0);
        this.inverseScreenTransformation = this.screenTransformation.inverse();
        this.polygon = ConvexPolygon.createRectangle(0, 0, this.viewboxWidth, this.viewboxHeight);
        this.measuredOnce = true;
    }
    public getViewboxPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.canvasElement.getBoundingClientRect();
        return this.inverseScreenTransformation.apply(new Point(clientX - left, clientY - top));
    }
}
