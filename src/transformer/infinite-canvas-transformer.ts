import { Transformer } from "./transformer"
import { Anchor } from "./anchor";
import { InfiniteCanvasMovable } from "./infinite-canvas-movable";
import { Gesture } from "./gesture";
import { InfiniteCanvasTransformerContext } from "./infinite-canvas-transformer-context";
import { Rotate } from "./rotate";
import { Zoom } from "./zoom";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { TransformableBox } from "../interfaces/transformable-box";
import { Point } from "../geometry/point";


export class InfiniteCanvasTransformer implements Transformer{
    private gesture: Gesture;
    private context: InfiniteCanvasTransformerContext;
    private _zoom: Zoom;
    constructor(private readonly viewBox: TransformableBox, config: InfiniteCanvasConfig){
        this.context = new InfiniteCanvasTransformerContext(viewBox, config);
    }
    private createAnchor(movable: InfiniteCanvasMovable): Anchor{
        const self: InfiniteCanvasTransformer = this;
        return {
            moveTo(x: number, y: number){
                movable.moveTo(x,y);
            },
            release(){
                self.gesture = self.gesture.withoutMovable(movable);
            }
        };
    }
    public zoom(x: number, y: number, scale: number): void{
        if(this._zoom){
            if(this._zoom.centerX === x && this._zoom.centerY === y){
                this._zoom.multiplyScale(scale);
            }else{
                this._zoom.cancel();
                this._zoom = undefined;
            } 
        }
        if(!this._zoom){
            console.log(`creating new zoom`)
            this._zoom = new Zoom(this.viewBox, x, y, scale, 1000, () => {
                console.log(`zoom ends`)
                this._zoom = undefined;
            });
        }
    }
    public getAnchor(x: number, y: number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable(new Point(x, y));
        if(!this.gesture){
            this.gesture = this.context.getGestureForOneMovable(movable);
            return this.createAnchor(movable);
        }
        const newGesture: Gesture = this.gesture.withMovable(movable);
        if(!newGesture){
            return undefined;
        }
        this.gesture = newGesture;
        return this.createAnchor(movable);
    }
    public getRotationAnchor(x: number, y:number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable(new Point(x, y));
        const rotate: Rotate = new Rotate(movable, this.viewBox);
        return {
            moveTo(x: number, y: number){
                movable.moveTo(x,y);
            },
            release(){
                rotate.end();
            }
        };
    }
}