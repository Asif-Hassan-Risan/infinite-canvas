import { Point } from "./point";
import { Transformation } from "./transformation";
import { isPoint } from "./is-point";
import { Area } from "./interfaces/area";

export class AreaChange{
    constructor(public execute: (transformation: Transformation, previous?: Point | Area) => Point | Area){

    }
    public static to(to?: Point | Area): AreaChange{
        return new AreaChange((transformation: Transformation, previous?: Area) => {
            if(to){
                if(isPoint(to)){
                    to = transformation.apply(to);
                }else{
                    to = to.transform(transformation);
                }
            }
            if(previous){
                return to ? previous.expandToInclude(to) : previous;
            }else if(to){
                return to;
            }
            return undefined;
        });
    }
}