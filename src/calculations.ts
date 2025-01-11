import {Double,O,Side,Single,Trailer} from "./types.ts";


export function toInches(feet:number):number {
   return 12*feet;
}

export function toFeet(inches:number):number {
   return Math.round(2*inches/12.0)/2;
}

export function rotatePosition(prev:Trailer, rowNum:number, side:Side):Trailer {
   let newTrailer:Trailer = JSON.parse(JSON.stringify(prev)) //deep copy
   const i = rowNum - 1
   switch (side) {
      case Side.L: {
         const orientation = String((prev.loadRows[i] as Double)?.l___?.orien);
         console.log(orientation);
         (newTrailer.loadRows[i] as Double).l___!.orien = orientation === String(O.Straight) ? O.Sideways : O.Straight;
         break;
      }
      case Side.C: {
         const orientation = String((prev.loadRows[i] as Single)?._ctr_?.orien);
         (newTrailer.loadRows[i] as Single)._ctr_!.orien = orientation === String(O.Straight) ? O.Sideways : O.Straight;
         break;
      }
      case Side.R: {
         const orientation = String((prev.loadRows[i] as Double)?.___r?.orien);
         (newTrailer.loadRows[i] as Double).___r!.orien = orientation === String(O.Straight) ? O.Sideways : O.Straight;
         break;
      }
   }
   recalcDepths(newTrailer)
   return newTrailer
}

function recalcDepths(trailer:Trailer) {
   let lDepth = 0
   let rDepth = 0
   let prevWasSingle = false
   trailer.loadRows.forEach((row,i) => {
      if (Side.L in row && Side.R in row) {
         row = row as Double
         if (row.l___ !== null) {
            if (i === 0)
               row.l___.depth = 0
            else
               row.l___.depth = prevWasSingle ? Math.max(lDepth,rDepth) : lDepth
            lDepth += row.l___.orien.L
         }
         if (row.___r !== null) {
            if (i === 0)
               row.___r.depth = 0
            else
               row.___r.depth = prevWasSingle ? Math.max(lDepth,rDepth) : rDepth
            rDepth += row.___r.orien.L
         }
         prevWasSingle = false //must be last in condition block
      }
      else if (Side.C in row) {
         row = row as Single
         const biggerDepth = Math.max(lDepth,rDepth)
         if (i === 0)
            row._ctr_.depth = 0
         else
            row._ctr_.depth = biggerDepth
         lDepth = biggerDepth + row._ctr_.orien.L
         rDepth = biggerDepth + row._ctr_.orien.L
         prevWasSingle = true //must be last in condition block
      }
   });
}