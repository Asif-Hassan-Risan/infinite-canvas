import { Transformer } from "../transformer/transformer"
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export function mapMouseEvents(
        canvasElement: HTMLCanvasElement,
        transformer: Transformer,
        rectangle: CanvasRectangle,
        config: InfiniteCanvasConfig): void{
            let mouseAnchorIdentifier: number;
            function releaseAnchor(): void{
                if(mouseAnchorIdentifier !== undefined){
                    transformer.releaseAnchorByIdentifier(mouseAnchorIdentifier);
                    mouseAnchorIdentifier = undefined;
                }
            }
            canvasElement.addEventListener("mousedown", (ev: MouseEvent) => {
                const {x: infCanvasX, y: infCanvasY} = rectangle.getCanvasContextPosition(ev.clientX, ev.clientY);
                console.log(`mousedown at (${infCanvasX}, ${infCanvasY})`)
                if(mouseAnchorIdentifier !== undefined){
                    return;
                }
                transformer.startTransformation();
                const {x, y} = rectangle.getCSSPosition(ev.clientX, ev.clientY);
                if(ev.button === 1){
                    if(!config.rotationEnabled){
                        return true;
                    }
                    mouseAnchorIdentifier = transformer.createRotationAnchor(x, y);
                }else{
                    mouseAnchorIdentifier = transformer.createAnchor(x, y);
                }
                ev.preventDefault();
                return false;
            });
            canvasElement.addEventListener("mousemove", (ev: MouseEvent) => {
                if(mouseAnchorIdentifier !== undefined){
                    const {x, y} = rectangle.getCSSPosition(ev.clientX, ev.clientY);
                    transformer.moveAnchorByIdentifier(mouseAnchorIdentifier, x, y);
                }
            });
            canvasElement.addEventListener("mouseup", (ev: MouseEvent) => {
                releaseAnchor();
            });
            canvasElement.addEventListener("mouseleave", (ev: MouseEvent) => {
                releaseAnchor();
            });
}