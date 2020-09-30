import { Transformer } from "./transformer"
import { Anchor } from "./anchor";
import { InfiniteCanvasMovable } from "./infinite-canvas-movable";
import { Gesture } from "./gesture";
import { Rotate } from "./rotate";
import { Zoom } from "./zoom";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { TransformableBox } from "../interfaces/transformable-box";
import { Point } from "../geometry/point";
import { AnchorSet } from "../events/anchor-set";
import { Transformation } from "../transformation";
import { Translate } from "./translate";
import { TranslateZoom } from "./translate-zoom";
import { TranslateRotateZoom } from "./translate-rotate-zoom";
import { Movable } from "./movable";
import { InfiniteCanvasEventDispatcher } from "../custom-events/infinite-canvas-event-dispatcher";
import { InfiniteCanvasEvent } from "../custom-events/infinite-canvas-event";
import { InfiniteCanvasTransformationEvent } from "../custom-events/infinite-canvas-transformation-event";


export class InfiniteCanvasTransformer implements Transformer{
    private gesture: Gesture;
    private anchorSet: AnchorSet;
    private _zoom: Zoom;
    private _transformationStart: InfiniteCanvasEventDispatcher<"transformationStart">;
    private _transformationChange: InfiniteCanvasEventDispatcher<"transformationChange">;
    private _transformationEnd: InfiniteCanvasEventDispatcher<"transformationEnd">;
    constructor(private readonly viewBox: TransformableBox, private readonly config: InfiniteCanvasConfig){
        this.anchorSet = new AnchorSet(() => this.dispatchTransformationEvent(this._transformationStart));
        this._transformationStart = new InfiniteCanvasEventDispatcher();
        this._transformationChange = new InfiniteCanvasEventDispatcher();
        this._transformationEnd = new InfiniteCanvasEventDispatcher();
    }
    public get transformationStart(): InfiniteCanvasEvent<"transformationStart">{return this._transformationStart;}
    public get transformationChange(): InfiniteCanvasEvent<"transformationChange">{return this._transformationChange;}
    public get transformationEnd(): InfiniteCanvasEvent<"transformationEnd">{return this._transformationEnd;}
    public get isTransforming(): boolean{
        return !!this._zoom || !this.anchorSet.isEmpty;
    }
    public get transformation(): Transformation{
        return this.viewBox.transformation;
    }
    public set transformation(value: Transformation){
        this.viewBox.transformation = value;
        this.dispatchTransformationEvent(this._transformationChange);
    }
    private dispatchTransformationEvent(dispatcher: InfiniteCanvasEventDispatcher<"transformationStart" | "transformationChange" | "transformationEnd">): void{
        const {a, b, c, d, e, f} = this.transformation;
        const event: InfiniteCanvasTransformationEvent = {
            transformation: {a, b, c, d, e, f}
        };
        dispatcher.dispatchEvent(event);
    }
    private checkTransformationEnded(): void{
        if(this.isTransforming){
            return;
        }
        this.dispatchTransformationEvent(this._transformationEnd);
    }
    public getGestureForOneMovable(movable: Movable): Gesture{
        return new Translate(movable, this);
    }
    public getGestureForTwoMovables(movable1: Movable, movable2: Movable): Gesture{
        if(this.config.rotationEnabled){
            return new TranslateRotateZoom(movable1, movable2, this);
        }
        return new TranslateZoom(movable1, movable2, this);
    }
    private createAnchorForMovable(movable: InfiniteCanvasMovable): Anchor{
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
    public createAnchorByExternalIdentifier(externalIdentifier: any, x: number, y: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByExternalIdentifier(externalIdentifier);
        if(existing){
            return;
        }
        const anchor: Anchor = this.getAnchor(x, y);
        this.anchorSet.addAnchor(anchor, externalIdentifier);
    }
    public createAnchor(x: number, y: number): number{
        const anchor: Anchor = this.getAnchor(x, y);
        return this.anchorSet.addAnchor(anchor);
    }
    public createRotationAnchor(x: number, y: number): number{
        const anchor: Anchor = this.getRotationAnchor(x, y);
        return this.anchorSet.addAnchor(anchor);
    }
    public moveAnchorByExternalIdentifier(externalIdentifier: any, x: number, y: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByExternalIdentifier(externalIdentifier);
        if(!existing){
            return;
        }
        existing.moveTo(x, y);
    }
    public moveAnchorByIdentifier(identifier: number, x: number, y: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByIdentifier(identifier);
        if(!existing){
            return;
        }
        existing.moveTo(x, y);
    }
    public releaseAnchorByExternalIdentifier(externalIdentifier: any): void{
        const existing: Anchor = this.anchorSet.getAnchorByExternalIdentifier(externalIdentifier);
        if(!existing){
            return;
        }
        existing.release();
        this.anchorSet.removeAnchorByExternalIdentifier(externalIdentifier);
        this.checkTransformationEnded();
    }
    public releaseAnchorByIdentifier(identifier: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByIdentifier(identifier);
        if(!existing){
            return;
        }
        existing.release();
        this.anchorSet.removeAnchorByIdentifier(identifier);
        this.checkTransformationEnded();
    }
    public zoom(x: number, y: number, scale: number): void{
        const wasTransforming: boolean = this.isTransforming;
        if(this._zoom){
            if(this._zoom.centerX === x && this._zoom.centerY === y){
                this._zoom.multiplyScale(scale);
            }else{
                this._zoom.cancel();
                this._zoom = undefined;
            } 
        }
        if(!this._zoom){
            this._zoom = new Zoom(this.viewBox, x, y, scale, 1000, () => {
                this._zoom = undefined;
                this.checkTransformationEnded();
            });
            if(!wasTransforming){
                this.dispatchTransformationEvent(this._transformationStart);
            }
        }
    }
    private getAnchor(x: number, y: number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable(new Point(x, y));
        if(!this.gesture){
            this.gesture = this.getGestureForOneMovable(movable);
            return this.createAnchorForMovable(movable);
        }
        const newGesture: Gesture = this.gesture.withMovable(movable);
        if(!newGesture){
            return undefined;
        }
        this.gesture = newGesture;
        return this.createAnchorForMovable(movable);
    }
    private getRotationAnchor(x: number, y:number): Anchor{
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