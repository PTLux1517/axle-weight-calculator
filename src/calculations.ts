import {
   AxleReferencePoint,
   Double,Load,
   O,
   Side,
   Single,
   SlideAxleNoRestrictionMaxLength,
   SlideAxleRestriction,
   SlideAxleRestrictionMaxLength,
   State,
   Trailer
} from "./types.ts";
import {slideAxleRestrictedStates,unrestrictedLength,unrestrictedReference} from "./slideAxleRestrictedStates.ts";


export function toInches(feet:number):number {
   return 12*feet;
}

export function toFeet(inches:number):number {
   return Math.round(2*inches/12.0)/2;
}

export function getStateTandemMaxLength(state:State|null):(SlideAxleRestrictionMaxLength|SlideAxleNoRestrictionMaxLength) {
   if (state===null) return unrestrictedLength;
   else return (slideAxleRestrictedStates.find(e => (
      e.hasOwnProperty("state") && (e as SlideAxleRestriction).state===state
   )) as SlideAxleRestriction).kingpinToTandemMaxLength
}

export function getStateTandemMeasurementReference(state:State|null):AxleReferencePoint {
   if (state===null) return unrestrictedReference;
   else return (slideAxleRestrictedStates.find(e => (
      e.hasOwnProperty("state") && (e as SlideAxleRestriction).state===state
   )) as SlideAxleRestriction).measurementReference
}

export function toTitleCase(str:String):String {
   return str.toLowerCase()
   .split(" ")
   .map(s => s.charAt(0).toUpperCase() + s.substring(1))
   .join(" ")
}

export function tandemCenterDistanceFromNoseToStateRefDistance(trailer:Trailer, state:State|null):number {
   const refPoint = getStateTandemMeasurementReference(state)
   switch (refPoint) {
      case AxleReferencePoint.Ctr: return trailer.tandemCenterDistanceFromNose - trailer.kingpinDistanceFromNose
      case AxleReferencePoint.Rear: return trailer.tandemCenterDistanceFromNose - trailer.kingpinDistanceFromNose + trailer.tandemSpreadWidth/2
   }
}

export function stateRefDistanceToAxleDistanceFromNose(axle:"F"|"R", trailer:Trailer, inputLengthInches:number, state:State|null):number {
   if (isNaN(inputLengthInches)) {inputLengthInches = toInches(40); alert("Distance From Kingpin input passed value of NaN to stateRefDistanceToAxleDistanceFromNose() function. Defaulting to 40'.");}
   const refPoint = getStateTandemMeasurementReference(state)
   switch (refPoint) {
      case AxleReferencePoint.Ctr:
         return trailer.kingpinDistanceFromNose + inputLengthInches + (() => {switch (axle) {
            case "F": return -trailer.tandemSpreadWidth/2;
            case "R": return trailer.tandemSpreadWidth/2;
         }})()
      case AxleReferencePoint.Rear:
         return trailer.kingpinDistanceFromNose + inputLengthInches + (() => {switch (axle) {
            case "F": return -trailer.tandemSpreadWidth;
            case "R": return 0;
         }})()
   }
}

export function rotatePosition(prev:Trailer&Load, rowNum:number, side:Side):Trailer&Load {
   let newTrailer:Trailer&Load = JSON.parse(JSON.stringify(prev)) //deep copy
   const i = rowNum - 1
   switch (side) {
      case Side.L: {
         const orientation = (prev.loadRows[i] as Double)?.l___?.orien?.text;
         if (orientation===undefined) {
            alert("rotate position called with wrong side argument")
            return prev
         }
         (newTrailer.loadRows[i] as Double).l___!.orien = orientation === O.Straight.text ? O.Sideways : O.Straight;
         break;
      }
      case Side.C: {
         const orientation = (prev.loadRows[i] as Single)?._ctr_?.orien?.text;
         if (orientation===undefined) {
            alert("rotate position called with wrong side argument")
            return prev
         }
         (newTrailer.loadRows[i] as Single)._ctr_!.orien = orientation === O.Straight.text ? O.Sideways : O.Straight;
         break;
      }
      case Side.R: {
         const orientation = (prev.loadRows[i] as Double)?.___r?.orien?.text;
         if (orientation===undefined) {
            alert("rotate position called with wrong side argument")
            return prev
         }
         (newTrailer.loadRows[i] as Double).___r!.orien = orientation === O.Straight.text ? O.Sideways : O.Straight;
         break;
      }
   }
   recalcDepths(newTrailer)
   return newTrailer
}

function recalcDepths(trailer:Trailer&Load) {
   let lDepth = 0
   let rDepth = 0
   let prevWasSingle = false
   trailer.loadRows.forEach((row,i) => {
      if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
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
      else if (row.hasOwnProperty(Side.C)) {
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