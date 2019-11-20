import {DrawingIterationProvider} from "./interfaces/drawing-iteration-provider";

export class AnimationFrameDrawingIterationProvider implements DrawingIterationProvider{
    public provideDrawingIteration(draw: () => void): () => void {
        let animationFrameRequested: boolean = false;
        return () => {
            if(animationFrameRequested){
                return;
            }
            animationFrameRequested = true;
            requestAnimationFrame(() => {
               draw();
               animationFrameRequested = false;
            });
        };
    }
}