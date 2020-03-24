export class Point{
	constructor(public readonly x: number, public readonly y: number){}
	public mod(): number{
		return Math.sqrt(this.modSq());
	}
	public modSq(): number{
		return this.x * this.x + this.y * this.y;
	}
	public minus(other: Point): Point{
		return new Point(this.x - other.x, this.y - other.y);
	}
	public plus(other: Point): Point{
		return new Point(this.x + other.x, this.y + other.y);
	}
	public dot(other: Point): number{
		return this.x * other.x + this.y * other.y;
	}
	public cross(other: Point): number{
		return this.x * other.y - this.y * other.x;
	}
	public equals(other: Point): boolean{
		return this.x === other.x && this.y === other.y;
	}
	public getPerpendicular(): Point{
		return new Point(-this.y, this.x);
	}
	public scale(r: number): Point{
		return new Point(r * this.x, r * this.y);
	}
	public projectOn(other: Point): Point{
		return other.scale(this.dot(other) / other.modSq());
	}
	public matrix(a: number, b: number, c: number, d: number): Point{
		return new Point(a * this.x + b * this.y, c * this.x + d * this.y);
	}
	public inSameDirectionAs(other: Point): boolean{
		return this.cross(other) === 0 && this.dot(other) >= 0;
	}
	public isInOppositeDirectionAs(other: Point): boolean{
		return this.cross(other) === 0 && this.dot(other) < 0;
	}
	public isInSmallerAngleBetweenPoints(point1: Point, point2: Point): boolean{
		if(point1.cross(point2) > 0){
            return point1.cross(this) >= 0 && this.cross(point2) >= 0;
        }
        return point1.cross(this) <= 0 && this.cross(point2) <= 0;
	}
	public static origin: Point = new Point(0, 0);
}