import { Transformation } from "../transformation";
import { Transformable } from "../transformable";

export class Zoom{
    private maxScaleLogStep: number;
    private currentScaleLog: number;
    private targetScaleLog: number;
    private initialTransformation: Transformation;
    private stepTimeout: any;
    private lifetimeTimeout: any;
    private lifetimeTimeoutPassed: boolean = false;
    private isDoneZooming: boolean = false;
    constructor(
        private readonly transformable: Transformable,
        public readonly centerX: number,
        public readonly centerY: number,
         targetScale: number,
         minTimeout: number,
        private readonly onFinish: () => void){
            this.lifetimeTimeout = setTimeout(() => this.afterTimeout(), minTimeout);
            this.maxScaleLogStep = 0.1;
            this.initialTransformation = transformable.transformation;
            this.currentScaleLog = 0;
            this.targetScaleLog = Math.log(targetScale);
            this.makeStep();
            
    }
    private afterZooming(): void{
        this.isDoneZooming = true;
        if(this.lifetimeTimeoutPassed){
            this.onFinish();
        }
    }
    private afterTimeout(): void{
        this.lifetimeTimeoutPassed = true;
        if(this.isDoneZooming){
            this.onFinish();
        }
    }
    private makeStep(): void{
        const distance: number = this.targetScaleLog - this.currentScaleLog;
        if(Math.abs(distance) <= this.maxScaleLogStep){
            this.currentScaleLog += distance;
            this.setTransformToCurrentScaleLog();
            this.afterZooming();
        }else{
            this.currentScaleLog += distance < 0 ? -this.maxScaleLogStep : this.maxScaleLogStep;
            this.setTransformToCurrentScaleLog();
            this.stepTimeout = setTimeout(() => this.makeStep(), 20);
        }
    }
    private setTransformToCurrentScaleLog(): void{
        this.transformable.transformation = this.initialTransformation.before(
            Transformation.zoom(
                this.centerX,
                this.centerY,
                Math.exp(this.currentScaleLog)));
    }
    public multiplyScale(scale: number){
        this.isDoneZooming = false;
        this.targetScaleLog += Math.log(scale);
        this.makeStep();
    }
    public cancel(): void{
        if(this.stepTimeout !== undefined){
            clearTimeout(this.stepTimeout);
        }
        if(this.lifetimeTimeout !== undefined){
            clearTimeout(this.lifetimeTimeout);
        }
    }
}