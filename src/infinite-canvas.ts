import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d"
import { InfiniteContext } from "./infinite-context/infinite-context"
import { ViewBox } from "./interfaces/viewbox";
import { InfiniteCanvasViewBox } from "./infinite-canvas-viewbox";
import { Transformer } from "./transformer/transformer"
import { InfiniteCanvasTransformer } from "./transformer/infinite-canvas-transformer";
import { InfiniteCanvasEvents } from "./events/infinite-canvas-events";
import { InfiniteCanvasConfig } from "./config/infinite-canvas-config";
import {AnimationFrameDrawingIterationProvider} from "./animation-frame-drawing-iteration-provider";
import { InfiniteCanvasEventMap } from "./custom-events/infinite-canvas-event-map";
import { InfiniteCanvasAddEventListenerOptions } from "./custom-events/infinite-canvas-add-event-listener-options";
import { InfiniteCanvasEventListener } from "./custom-events/infinite-canvas-event-listener";
import { EventDispatchers } from "./custom-events/event-dispatchers";
import { InfiniteCanvasEventDispatcher } from "./custom-events/infinite-canvas-event-dispatcher";
import { DrawingIterationProviderWithCallback } from "./drawing-iteration-provider-with-callback";
import { LockableDrawingIterationProvider } from "./lockable-drawing-iteration-provider";
import {CanvasRectangle} from "./rectangle/canvas-rectangle";
import {HTMLCanvasRectangle} from "./rectangle/html-canvas-rectangle";
import { HtmlCanvasMeasurementProvider } from "./rectangle/html-canvas-measurement-provider";

export class InfiniteCanvas implements InfiniteCanvasConfig{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	private transformer: Transformer;
	private config: InfiniteCanvasConfig;
	private eventDispatchers: EventDispatchers;
	private drawEventDispatcher: InfiniteCanvasEventDispatcher<"draw">;
	constructor(private readonly canvas: HTMLCanvasElement, config?: InfiniteCanvasConfig){
		this.config = config || {rotationEnabled: true, greedyGestureHandling: false};
		const drawingIterationProvider: DrawingIterationProviderWithCallback = new DrawingIterationProviderWithCallback(new AnimationFrameDrawingIterationProvider());
		drawingIterationProvider.onDraw(() => this.dispatchDrawEvent());
		const lockableDrawingIterationProvider: LockableDrawingIterationProvider = new LockableDrawingIterationProvider(drawingIterationProvider);
		const canvasRectangle: CanvasRectangle = new HTMLCanvasRectangle(new HtmlCanvasMeasurementProvider(canvas));
		this.viewBox = new InfiniteCanvasViewBox(
			canvasRectangle,
			canvas.getContext("2d"),
			lockableDrawingIterationProvider,
			() => lockableDrawingIterationProvider.getLock(),
			() => this.transformer.isTransforming);
		this.transformer = new InfiniteCanvasTransformer(this.viewBox, this.config);
		const events: InfiniteCanvasEvents = new InfiniteCanvasEvents(canvas, this.transformer, this.config, canvasRectangle);
		this.drawEventDispatcher = new InfiniteCanvasEventDispatcher();
		this.eventDispatchers = {
			draw: this.drawEventDispatcher,
			transformationStart: this.transformer.transformationStart,
			transformationChange: this.transformer.transformationChange,
			transformationEnd: this.transformer.transformationEnd
		};
		this.transformer.transformationStart.addListener(() => canvasRectangle.measure())
	}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas, this.viewBox);
		}
		return this.context;
	}
	public get rotationEnabled(): boolean{
		return this.config.rotationEnabled;
	}
	public set rotationEnabled(value: boolean){
		this.config.rotationEnabled = value;
	}
	public get greedyGestureHandling(): boolean{
		return this.config.greedyGestureHandling;
	}
	public set greedyGestureHandling(value: boolean){
		this.config.greedyGestureHandling = value;
	}
	public addEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void{
		const eventDispatcher = this.eventDispatchers[type];
		eventDispatcher.addListener((ev: InfiniteCanvasEventMap[K]) => {
			listener(ev);
		}, options);
	}
	private dispatchDrawEvent(): void{
		this.drawEventDispatcher.dispatchEvent({});
	}
}
