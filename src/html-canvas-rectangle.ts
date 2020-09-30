import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import {CanvasRectangle} from "./interfaces/canvas-rectangle";
import { Transformation } from "./transformation";

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    public polygon: ConvexPolygon;
    private screenWidth: number;
    private screenHeight: number;
    private measuredOnce: boolean = false;
    constructor(private readonly canvasElement: HTMLCanvasElement) {
        this.measure();
    }
    public measure(): void{
        
        const viewboxWidth: number = this.canvasElement.width;
        const viewboxHeight: number = this.canvasElement.height;
        var rect = this.canvasElement.getBoundingClientRect();
        const screenWidth: number = rect.width;
        const screenHeight: number = rect.height;
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
        this.polygon = ConvexPolygon.createRectangle(0, 0, this.viewboxWidth, this.viewboxHeight);
        this.measuredOnce = true;
    }
}
