import { Transformation } from "../transformation";
import { Area } from "./area";

export class AreaChange{
    constructor(public execute: (transformation: Transformation, previous?: Area) => Area){

    }
    public static to(to?: Area): AreaChange{
        return new AreaChange((transformation: Transformation, previous?: Area) => {
            if(to){
                // if(isPoint(to)){
                //     to = transformation.apply(to);
                // }else{
                //     to = to.transform(transformation);
                // }
                to = to.transform(transformation);
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