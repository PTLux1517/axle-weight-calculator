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

import {Load,Named,O,P,Trailer} from './types.ts';
import {toInches,toLoad} from "./calculations.ts";

/* measurements according to https://tprimelogistics.com/wp-content/uploads/2019/04/53-air-ride-roll-door-1.jpg */
export const minTandCenterSlideLengthFromNose = toInches(53) - 169
export const maxTandCenterSlideLengthFromNose = toInches(53) - 78 //intentionally 1" off to match SlideAxleNoRestrictionMaxLength = 46.5 type definition

export const defaultTrailerDimensions:Trailer = {
   interiorLength: toInches(51.5),
   kingpinDistanceFromNose: toInches(3),
   tandemCenterDistanceFromNose: toInches(41),
   tandemSpreadWidth: toInches(4),
}

export const minSlideTrailer:Trailer = {
   ...defaultTrailerDimensions,
   tandemCenterDistanceFromNose: minTandCenterSlideLengthFromNose,
}

export const maxSlideTrailer:Trailer = {
   ...defaultTrailerDimensions,
   tandemCenterDistanceFromNose: maxTandCenterSlideLengthFromNose,
}

export const emptyTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "empty",
   rows: []
}

export const maxRowsAllStraightTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "max rows all straight",
   rows: [
      {_C_: {depth: 0*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {L__: {depth: 1*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 1*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {L__: {depth: 2*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 2*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {L__: {depth: 3*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 3*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},

      {L__: {depth: 4*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 4*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {L__: {depth: 5*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 5*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {L__: {depth: 6*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 6*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {L__: {depth: 7*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, __R: {depth: 7*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},

      {_C_: {depth: 8*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}},
      {L__: {depth: 9*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}, __R: {depth: 9*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}},
      {_C_: {depth: 10*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}},
      {L__: {depth: 11*O.Straight.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}, __R: {depth: 11*O.Straight.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}},

      {L__: {depth: 11*O.Straight.L + O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}, __R: {depth: 11*O.Straight.L + O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}},
   ]
}

export const costcoMaxWeightTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "costco max weight",
   rows: [
      {L__: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {L__: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {L__: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {L__: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 13*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 13*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}},
   ]
}

export const costcoAllShredTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "costco all shred",
   rows: [
      {L__: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},

      {L__: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},

      {L__: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {L__: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},

      {L__: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, __R: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
   ]
}

export const costco24ChunkTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "costco max weight",
   rows: [
      {L__: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {L__: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {L__: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {L__: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      //{L__: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, __R: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
   ]
}

export const toscaOriginal:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "tosca original pattern",
   ...toLoad({
      rows: [
         [P.TLegs,P.TLegs],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TShortStacks,P.TShortStacks],
         [P.TShortStacks,P.TSprings,P.TShortStacks],
         [P.TLegs,P.TLegs],
      ]
   })
}

export const toscaBoardHeavy:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "tosca board-heavy pattern",
   ...toLoad({
      rows: [
         [P.TShortSingle,P.TShortSingle],
         [P.TShortSingle,P.TShortSingle,P.TShortSingle],
         [P.TShortSingle,P.TShortSingle],
         [P.TShortSingle,P.TShortSingle,P.TShortSingle],
         [P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs],
         [P.T3Tabs,P.TBrackets,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.TBrackets,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.TLegs,P.T3Tabs],
         [P.T3Tabs,P.TLegs,P.T3Tabs],
      ]
   })
}

export const toscaFrameHeavy:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "tosca frame-heavy pattern",
   ...toLoad({
      rows: [
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TShortStacks,P.TShortStacks,P.TShortStacks],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
      ]
   })
}

export const toscaBalanced:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "tosca balanced pattern",
   ...toLoad({
      rows: [
         [P.TShortSingle,P.TShortSingle,P.TShortSingle],
         [P.TShortSingle,P.TShortSingle,P.TShortSingle],
         [P.TShortSingle,P.TShortSingle,P.TShortSingle],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.T0Tabs,P.T0Tabs,P.T0Tabs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TSprings,P.TBrackets], //can sub any one excess item in the springs position, even 3-tabs which are the heaviest
      ]
   })
}

export const toscaExcess:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "tosca excess",
   ...toLoad({
      rows: [
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.T0Tabs,P.T2Tabs,P.T0Tabs],
         [P.T0Tabs,P.T2Tabs,P.T0Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T2Tabs,P.T2Tabs,P.T2Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.T3Tabs,P.T3Tabs,P.T3Tabs],
         [P.TShortStacks,P.TShortStacks],
         [P.TShortStacks,P.TShortStacks,P.TShortStacks],
         [P.TShortStacks,P.TShortStacks],
         [P.TShortStacks,P.TShortStacks,P.TShortStacks],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TBrackets,P.TBrackets,P.TBrackets],
         [P.TShortStacks,P.TShortStacks,P.TShortStacks],
         [P.TShortStacks,P.TShortStacks,P.TShortStacks],
         [P.TLegs,P.TLegs,P.TLegs],
         [P.TLegs,P.TLegs,P.TLegs],
      ]
   })
}