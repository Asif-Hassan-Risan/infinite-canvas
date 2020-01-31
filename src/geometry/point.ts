export class Point{
	constructor(public readonly x: number, public readonly y: number){}
	public mod(): number{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	public minus(other: Point): Point{
		return new Point(this.x - other.x, this.y - other.y);
	}
	public dot(other: Point): number{
		return this.x * other.x + this.y * other.y;
	}
	public cross(other: Point): number{
		return this.x * other.y - this.y * other.x;
	}
	public inSameDirectionAs(other: Point): boolean{
		return this.cross(other) === 0 && this.dot(other) >= 0;
	}
	public static origin: Point = new Point(0, 0);
}