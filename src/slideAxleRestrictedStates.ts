/*
Axle Weight Calculator - A job site specific tool for calculating load weight
distribution, tailored to the needs of such anonymous company, but also available
open source under the following AGPL license for any who may also find it useful.

Copyright (C) 2026 Cory Tomlinson

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://gnu.org>.
*/

import {AxleReferencePoint,SlideAxleNoRestrictionMaxLength,SlideAxleRestriction,State} from "./types.ts";
import {maxSlideTrailer} from "./sampleTrailers.ts";
import {toFeet} from "./calculations.ts";


export enum SlideAxleRestrictionsDivider {str = "-------------------------------------"}

//source: https://www.bigtruckguide.com/kingpin-to-rear-axle/
export const slideAxleRestrictedStates:Array<SlideAxleRestriction|SlideAxleRestrictionsDivider> = [
   SlideAxleRestrictionsDivider.str,
   {state: State.CA, kingpinToTandemMaxLength: 40, measurementReference: AxleReferencePoint.Rear},
   SlideAxleRestrictionsDivider.str,
   {state: State.RI, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Rear},
   SlideAxleRestrictionsDivider.str,
   {state: State.AL, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.AK, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.FL, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.MD, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.NH, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.NJ, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.NC, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.PA, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.SC, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.TN, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.VT, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.VA, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   {state: State.WV, kingpinToTandemMaxLength: 41, measurementReference: AxleReferencePoint.Ctr},
   SlideAxleRestrictionsDivider.str,
   {state: State.CT, kingpinToTandemMaxLength: 43, measurementReference: AxleReferencePoint.Rear},
   {state: State.IN, kingpinToTandemMaxLength: 43, measurementReference: AxleReferencePoint.Rear},
   {state: State.NY, kingpinToTandemMaxLength: 43, measurementReference: AxleReferencePoint.Rear},
   SlideAxleRestrictionsDivider.str,
   {state: State.MN, kingpinToTandemMaxLength: 43, measurementReference: AxleReferencePoint.Ctr},
   {state: State.WI, kingpinToTandemMaxLength: 43, measurementReference: AxleReferencePoint.Ctr},
   SlideAxleRestrictionsDivider.str,
   {state: State.IL, kingpinToTandemMaxLength: 45.5, measurementReference: AxleReferencePoint.Rear},
   {state: State.ME, kingpinToTandemMaxLength: 45.5, measurementReference: AxleReferencePoint.Rear},
];

export const unrestrictedLength:SlideAxleNoRestrictionMaxLength = toFeet(maxSlideTrailer.tandemCenterDistanceFromNose) as SlideAxleNoRestrictionMaxLength
export const unrestrictedReference:AxleReferencePoint = AxleReferencePoint.Ctr

export const slideAxleUnrestrictedStates:Array<SlideAxleRestriction> = [
   {state: State.AZ, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.AR, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.CO, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.DE, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.GA, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.HI, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.ID, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.IA, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.KS, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.KY, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.LA, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.MA, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.MI, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.MS, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.MO, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.MT, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.NE, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.NV, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.NM, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.ND, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.OH, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.OK, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.OR, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.SD, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.TX, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.UT, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.WA, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
   {state: State.WY, kingpinToTandemMaxLength: unrestrictedLength, measurementReference: unrestrictedReference},
];