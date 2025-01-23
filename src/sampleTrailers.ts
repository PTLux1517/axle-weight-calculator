import {Load,Named,O,P,Trailer} from './types.ts';
import {toInches} from "./calculations.ts";

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
   loadRows: []
}

export const maxRowsAllStraightTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "max rows all straight",
   loadRows: [
      {_ctr_: {depth: 0*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {l___: {depth: 1*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 1*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {l___: {depth: 2*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 2*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {l___: {depth: 3*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 3*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},

      {l___: {depth: 4*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 4*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {l___: {depth: 5*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 5*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {l___: {depth: 6*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 6*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},
      {l___: {depth: 7*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}, ___r: {depth: 7*O.Straight.L, orien: O.Straight, stack: [{prdWt: 2000, palWt: P.Chep}]}},

      {_ctr_: {depth: 8*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}},
      {l___: {depth: 9*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}, ___r: {depth: 9*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}},
      {_ctr_: {depth: 10*O.Straight.L, orien: O.Straight, stack: [{prdWt: 1440, palWt: P.Chep}]}},
      {l___: {depth: 11*O.Straight.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}, ___r: {depth: 11*O.Straight.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}},

      {l___: {depth: 11*O.Straight.L + O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}, ___r: {depth: 11*O.Straight.L + O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1440, palWt: P.Chep}]}},
   ]
}

export const costcoMaxWeightTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "costco max weight",
   loadRows: [
      {l___: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {l___: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {l___: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

      {l___: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
      {l___: {depth: 13*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 13*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}]}},
   ]
}

export const costcoAllShredTrailer:Named&Trailer&Load = {
   ...defaultTrailerDimensions,
   name: "costco all shred",
   loadRows: [
      {l___: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 1*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 2*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 3*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},

      {l___: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 4*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 5*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 6*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 7*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},

      {l___: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 8*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 9*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 10*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
      {l___: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 11*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},

      {l___: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 12*O.Sideways.L, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep},{prdWt: 720, palWt: P.Chep}]}},
   ]
}