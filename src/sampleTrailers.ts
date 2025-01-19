import {Load,O,P,Trailer} from './types.ts';
import {toInches} from "./calculations.ts";

/* measurements according to https://tprimelogistics.com/wp-content/uploads/2019/04/53-air-ride-roll-door-1.jpg */
export const minTandCenterSlideLengthFromNose = toInches(53) - 169
export const maxTandCenterSlideLengthFromNose = toInches(53) - 78 //intentionally 1" off to match SlideAxleNoRestrictionMaxLength = 46.5 type definition

export const defaultTrailerEmpty:Trailer = {
   interiorLength: toInches(51.5),
   kingpinDistanceFromNose: toInches(3),
   tandemCenterDistanceFromNose: toInches(41),
   tandemSpreadWidth: toInches(4),
}

export const minSlideTrailer:Trailer = {
   ...defaultTrailerEmpty,
   tandemCenterDistanceFromNose: minTandCenterSlideLengthFromNose,
}

export const maxSlideTrailer:Trailer = {
   ...defaultTrailerEmpty,
   tandemCenterDistanceFromNose: maxTandCenterSlideLengthFromNose,
}

export const maxLengthStraightTrailer:Trailer&Load = {
   ...defaultTrailerEmpty,
   loadRows: [
      {_ctr_: {depth: 48*0, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*1, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*2, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*3, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},

      {_ctr_: {depth: 48*4, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*5, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*6, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*7, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},

      {_ctr_: {depth: 48*8, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*9, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*10, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
      {_ctr_: {depth: 48*11, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},

      {_ctr_: {depth: 48*11 + 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   ]
}

export const maxWeightCostcoTrailer:Trailer&Load = {
   ...defaultTrailerEmpty,
   loadRows: [
      {l___: {depth: 0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 80, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 80, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 120, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 120, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},

      {l___: {depth: 160, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 160, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 200, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 200, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 240, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 240, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 280, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 280, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},

      {l___: {depth: 320, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 320, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 360, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 360, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 400, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 400, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 440, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 440, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},

      {l___: {depth: 480, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 480, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 520, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 520, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}},
      //{l___: {depth: 520, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 520, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      //{l___: {depth: 560, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 560, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
   ]
}