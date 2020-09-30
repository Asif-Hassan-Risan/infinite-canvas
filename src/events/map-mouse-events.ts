import { Transformer } from "../transformer/transformer"
import { Point } from "../geometry/point";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";

export function mapMouseEvents(
        canvasElement: HTMLCanvasElement,
        transformer: Transformer,
        getRelativePosition: (clientX: number, clientY: number) => Point,
        config: InfiniteCanvasConfig): void{
            let mouseAnchorIdentifier: number;
            function releaseAnchor(): void{
                if(mouseAnchorIdentifier !== undefined){
                    transformer.releaseAnchorByIdentifier(mouseAnchorIdentifier);
                    mouseAnchorIdentifier = undefined;
                }
            }
            canvasElement.addEventListener("mousedown", (ev: MouseEvent) => {
                if(mouseAnchorIdentifier !== undefined){
                    return;
                }
                const {x, y} = getRelativePosition(ev.clientX, ev.clientY);
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
                    const {x, y} = getRelativePosition(ev.clientX, ev.clientY);
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