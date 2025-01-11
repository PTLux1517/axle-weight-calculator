import {Double,O,Side,Single,Trailer} from "./types.ts";


export function toInches(feet:number):number {
   return 12*feet;
}

export function toFeet(inches:number):number {
   return Math.round(2*inches/12.0)/2;
}

function rotatePosition(prev:Trailer, rowNum:number, side:Side):Trailer {
   let newTrailer:Trailer = {...prev}
   switch (side) {
      case Side.L: {
         const orientation = String((prev.loadRows[rowNum] as Double).l___?.orien);
         (newTrailer.loadRows[rowNum] as Double).l___!.orien = orientation === String(O.Straight) ? O.Sideways : O.Straight;
         break;
      }
      case Side.C: {
         const orientation = String((prev.loadRows[rowNum] as Single)._ctr_?.orien);
         (newTrailer.loadRows[rowNum] as Single)._ctr_!.orien = orientation === String(O.Straight) ? O.Sideways : O.Straight;
         break;
      }
      case Side.R: {
         const orientation = String((prev.loadRows[rowNum] as Double).___r?.orien);
         (newTrailer.loadRows[rowNum] as Double).___r!.orien = orientation === String(O.Straight) ? O.Sideways : O.Straight;
         break;
      }
   }
   return newTrailer
}