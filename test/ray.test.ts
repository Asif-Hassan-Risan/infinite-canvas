import { Ray } from "../src/areas/ray";
import { r, p } from "./builders";
import { Point } from "../src/geometry/point";
import { Area } from "../src/areas/area";
import { expectAreasToBeEqual } from "./expectations";

describe("a ray", () => {
    let ray: Ray;

    beforeEach(() => {
        ray = r(r => r.base(0, 0).direction(1, 0));
    });

    it.each([
        [new Point(-1, 0), r(r => r.base(-1, 0).direction(1, 0))],
        [new Point(0, 0), r(r => r.base(0, 0).direction(1, 0))],
        [new Point(1, 0), r(r => r.base(0, 0).direction(1, 0))],
        [new Point(1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(1, 1).normal(0, -1))
            .with(hp => hp.base(1, 1).normal(1, -1)))],
        [new Point(-1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(-1, 1).normal(0, -1))
            .with(hp => hp.base(-1, 1).normal(1, 1)))],
        [new Point(-1, -1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(-1, -1).normal(0, 1))
            .with(hp => hp.base(-1, -1).normal(1, -1)))],
        [new Point(1, -1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(1, -1).normal(0, 1))
            .with(hp => hp.base(1, -1).normal(1, 1)))]
    ])("should result in the correct expansions with a point", (point: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(ray.expandToIncludePoint(point), expectedExpansion);
    });
});