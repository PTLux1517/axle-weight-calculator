import {
   AxleReferencePoint,AxleWeights,
   Double,
   Load,
   O,placeholderPosition,Position,
   RearAxleTypeCapacity,
   Side,
   Single,
   SlideAxleNoRestrictionMaxLength,
   SlideAxleRestriction,
   SlideAxleRestrictionMaxLength,
   State,
   Trailer,trailerWeightEmptyMinusAxlesAndReefer
} from "./types.ts";
import {slideAxleRestrictedStates,unrestrictedLength,unrestrictedReference} from "./slideAxleRestrictedStates.ts";


export function deepCopy<T>(original:T):T {
   return JSON.parse(JSON.stringify(original)) as T
}

export function toInches(feet:number):number {
   return 12*feet;
}

export function toFeet(inches:number):number {
   return Math.round(2*inches/12.0)/2;
}

/* feet */
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

/* inches */
export function tandemCenterDistanceFromNoseToStateRefDistance(trailer:Trailer, state:State|null):number {
   const refPoint = getStateTandemMeasurementReference(state)
   switch (refPoint) {
      case AxleReferencePoint.Ctr: return trailer.tandemCenterDistanceFromNose - trailer.kingpinDistanceFromNose
      case AxleReferencePoint.Rear: return trailer.tandemCenterDistanceFromNose - trailer.kingpinDistanceFromNose + trailer.tandemSpreadWidth/2
   }
}

/* inches */
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
   let newTrailer:Trailer&Load = deepCopy(prev)
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

function convertDoubleToSingle(rowNum:number, trailer:Trailer&Load) {
   const rowToConvert = trailer.loadRows[rowNum-1]
   if (!(rowToConvert.hasOwnProperty(Side.L) && rowToConvert.hasOwnProperty(Side.R))) return
   const double:Double = rowToConvert as Double
   const data:Position = double.l___!==null
      ? double.l___
      : double.___r!==null
         ? double.___r
         : placeholderPosition
   trailer.loadRows[rowNum-1] = { _ctr_: data }
}

export function deletePosition(rowNum:number, side:Side, trailer:Trailer&Load):Trailer&Load {
   let returnTrailer:Trailer&Load;
   const i = rowNum - 1
   switch (side) {
      case Side.C: {
         const deletedLength = (trailer.loadRows[i] as Single)._ctr_.orien.L
         returnTrailer = {
            ...trailer,
            loadRows: trailer.loadRows
               .map((row,idx) => {
                  if (idx<=i) return row
                  else if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
                     let movedRow = deepCopy(row) as Double
                     if (movedRow.l___!==null) movedRow.l___.depth -= deletedLength
                     if (movedRow.___r!==null) movedRow.___r.depth -= deletedLength
                     return movedRow
                  }
                  else {
                     let movedRow = deepCopy(row) as Single
                     movedRow._ctr_.depth -= deletedLength
                     return movedRow
                  }
               })
               .filter((_,idx) => idx!==i)
         }
         break;
      }
      case Side.L: {
         let after = deepCopy(trailer);
         (after.loadRows[i] as Double).l___ = null
         convertDoubleToSingle(rowNum, after)
         returnTrailer = after
         break;
      }
      case Side.R: {
         let after = deepCopy(trailer);
         (after.loadRows[i] as Double).___r = null
         convertDoubleToSingle(rowNum, after)
         returnTrailer = after
         break;
      }
   }
   return returnTrailer
}

export function swapPositions(rowNum1:number, side1:Side, rowNum2:number, side2:Side, trailer:Trailer&Load):Trailer&Load {
   let returnTrailer:Trailer&Load = deepCopy(trailer)
   let pos1Data:Position
   let pos2Data:Position
   switch (side1) {
      case Side.C: pos1Data = (trailer.loadRows[rowNum1-1] as Single)._ctr_; break;
      case Side.L: pos1Data = (trailer.loadRows[rowNum1-1] as Double).l___ ?? placeholderPosition; break;
      case Side.R: pos1Data = (trailer.loadRows[rowNum1-1] as Double).___r ?? placeholderPosition; break;
   }
   switch (side2) {
      case Side.C: pos2Data = (trailer.loadRows[rowNum2-1] as Single)._ctr_; break;
      case Side.L: pos2Data = (trailer.loadRows[rowNum2-1] as Double).l___ ?? placeholderPosition; break;
      case Side.R: pos2Data = (trailer.loadRows[rowNum2-1] as Double).___r ?? placeholderPosition; break;
   }
   switch (side1) {
      case Side.C: (returnTrailer.loadRows[rowNum1-1] as Single)._ctr_.stack = deepCopy(pos2Data.stack); break;
      case Side.L: (returnTrailer.loadRows[rowNum1-1] as Double).l___!.stack = deepCopy(pos2Data.stack); break;
      case Side.R: (returnTrailer.loadRows[rowNum1-1] as Double).___r!.stack = deepCopy(pos2Data.stack); break;
   }
   switch (side2) {
      case Side.C: (returnTrailer.loadRows[rowNum2-1] as Single)._ctr_.stack = deepCopy(pos1Data.stack); break;
      case Side.L: (returnTrailer.loadRows[rowNum2-1] as Double).l___!.stack = deepCopy(pos1Data.stack); break;
      case Side.R: (returnTrailer.loadRows[rowNum2-1] as Double).___r!.stack = deepCopy(pos1Data.stack); break;
   }
   return returnTrailer
}

export function recalcDepths(trailer:Trailer&Load) {
   let lDepth = 0
   let rDepth = 0
   let prevWasSingle = false
   trailer.loadRows.forEach((row,i) => {
      if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
         const lastIterLDepth = lDepth
         const lastIterRDepth = rDepth
         row = row as Double
         if (row.l___ !== null) {
            if (i === 0)
               row.l___.depth = 0
            else
               row.l___.depth = prevWasSingle ? Math.max(lastIterLDepth,lastIterRDepth) : lDepth
            lDepth += row.l___.orien.L
         }
         if (row.___r !== null) {
            if (i === 0)
               row.___r.depth = 0
            else
               row.___r.depth = prevWasSingle ? Math.max(lastIterLDepth,lastIterRDepth) : rDepth
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

export function calcAxleWeights(trailer:Trailer&Load, unloaded:AxleWeights, rearAxleType:RearAxleTypeCapacity):AxleWeights {
   const trailerBodyWeightPerLinearInch = trailerWeightEmptyMinusAxlesAndReefer / trailer.interiorLength
   const tandemCenterDistanceFromMaxRearwardPosition = trailer.interiorLength - trailer.tandemCenterDistanceFromNose - trailer.tandemSpreadWidth/2
   const additionalTrailerWeightRear = trailerBodyWeightPerLinearInch * tandemCenterDistanceFromMaxRearwardPosition
   let loaded:AxleWeights = {...unloaded}
   loaded.drives -= additionalTrailerWeightRear
   loaded.fTandem += additionalTrailerWeightRear/2
   loaded.rTandem += additionalTrailerWeightRear/2
   let showAlert = false
   trailer.loadRows.forEach(row => {
      Object.values(row).forEach(pos => {
         if (pos===null) return;
         /* COM: center of mass distance from nose | COM2KP: com to kingpin | COM2TC: com to tandem center | COM2FT: com to front tandem | COM2RT: com to rear tandem */
         const COM = pos.depth + pos.orien.L/2.0,
               COM2KP = COM - trailer.kingpinDistanceFromNose,
               COM2TC = COM - trailer.tandemCenterDistanceFromNose,
               COM2FT = COM2TC - trailer.tandemSpreadWidth/2,
               COM2RT = COM2TC + trailer.tandemSpreadWidth/2;
         let span = rearAxleType===RearAxleTypeCapacity.Tandem
            ? trailer.tandemCenterDistanceFromNose-trailer.kingpinDistanceFromNose
            : (trailer.tandemCenterDistanceFromNose - trailer.tandemSpreadWidth/2) - trailer.kingpinDistanceFromNose
         const posWt = pos.stack.map(pal => pal.prdWt + pal.palWt).reduce((acc,wt) => acc + wt, 0)
         if (COM2KP <= 0) { //position is in front of kingpin: weight contribution is 100% to drives
            loaded.drives += posWt
            const percentBeyondKingpin = (trailer.kingpinDistanceFromNose-COM)/span
            const additionalWeight = posWt * percentBeyondKingpin
            loaded.drives += additionalWeight
            loaded.fTandem -= additionalWeight/2
            loaded.rTandem -= additionalWeight/2
         }
         else if (rearAxleType===RearAxleTypeCapacity.Tandem) {
            if (COM2TC < 0) { //position is between kingpin and tandem center (non-inclusive): weight contribution is interpolated between drives and tandems
               const percentRearward = (COM-trailer.kingpinDistanceFromNose)/span
               const noseContribution = posWt * (1-percentRearward)
               const tailContribution = posWt - noseContribution
               loaded.drives += noseContribution
               loaded.fTandem += tailContribution/2
               loaded.rTandem += tailContribution/2
            }
            else { //position is on or beyond tandem center: weight contribution is 100% to tandems
               loaded.fTandem += posWt/2
               loaded.rTandem += posWt/2
               const percentBeyondTandems = (COM-trailer.tandemCenterDistanceFromNose)/span
               const additionalWeight = posWt * percentBeyondTandems
               loaded.fTandem += additionalWeight/2
               loaded.rTandem += additionalWeight/2
               loaded.drives -= additionalWeight
            }
         }
         else if (rearAxleType===RearAxleTypeCapacity.Spread) {
            showAlert = true
            console.log(COM2FT)
            console.log(COM2RT)
         }
      })
   })
   if (showAlert) alert("spread axle weight calculation not implemented yet")
   return loaded
}

export function totalGrossWt(loaded:AxleWeights):number {
   return loaded.steers + loaded.drives + loaded.fTandem + loaded.rTandem
}

export function totalLoadWt(loaded:AxleWeights, unloaded:AxleWeights):number {
   return totalGrossWt(loaded) - totalGrossWt(unloaded)
}