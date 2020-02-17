import { InfiniteCanvasAreaBuilder } from "../src/areas/infinite-canvas-area-builder";
import { Area } from "../src/areas/area";
import { empty } from "../src/areas/empty";
import { Point } from "../src/geometry/point";
import { expectAreasToBeEqual } from "./expectations";
import { ls, p, r } from "./builders";
import { plane } from "../src/areas/plane";

type AreaBuildStep = [(builder: InfiniteCanvasAreaBuilder) => void, Area];
type AreaBuildTestData = [((builder: InfiniteCanvasAreaBuilder) => void)[], Area];

function createStepData(steps: AreaBuildStep[]): AreaBuildTestData[]{
    const result: AreaBuildTestData[] = [];
    for(let i:number = 0; i < steps.length; i++){
        const stepsToInclude: AreaBuildStep[] = steps.slice(0, i + 1);
        const seed: AreaBuildTestData = [[], undefined];
        result.push(stepsToInclude.reduce((result, step) => [result[0].concat([step[0]]), step[1]], seed));
    }
    return result;
}

describe("an area builder", () => {
    let areaBuilder: InfiniteCanvasAreaBuilder;
    
    beforeEach(() => {
        areaBuilder = new InfiniteCanvasAreaBuilder();
    });

    it.each(createStepData([
        [b => b.addPoint(new Point(0, 0)), empty],
        [b => b.addPoint(new Point(1, 0)), ls(ls => ls.from(0, 0).to(1, 0))],
        [b => b.addPoint(new Point(2, 0)), ls(ls => ls.from(0, 0).to(2, 0))],
        [b => b.addPoint(new Point(2, 2)), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(2, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(0, -1)), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(2, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(0, 1)), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(2, 0).normal(-1, 0)))],
        [b => b.addPoint(new Point(3, 0)), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(3, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(-1, 0)), p(p => p
            .with(hp => hp.base(3, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(1, 0)), plane]
    ]))("should have the correct area at each step", (instructions: ((builder: InfiniteCanvasAreaBuilder) => void)[], expectedArea: Area) => {
        for(let instruction of instructions){
            instruction(areaBuilder);
        }
        expectAreasToBeEqual(areaBuilder.area, expectedArea)
    });

    it.each(createStepData([
        [b => b.addPoint(new Point(0, 0)), empty],
        [b => b.addInfinityInDirection(new Point(0, 1)), r(r => r.base(0, 0).direction(0, 1))],
        [b => b.addInfinityInDirection(new Point(-1, 1)), p(p => p
            .with(hp => hp.base(0, 0).normal(-1, 0))
            .with(hp => hp.base(0, 0).normal(1, 1)))],
    ]))("should have the correct area at each step", (instructions: ((builder: InfiniteCanvasAreaBuilder) => void)[], expectedArea: Area) => {
        for(let instruction of instructions){
            instruction(areaBuilder);
        }
        expectAreasToBeEqual(areaBuilder.area, expectedArea)
    });
});