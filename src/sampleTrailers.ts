import {Load,LoadTemplate,Named,O,P,RO,Trailer} from './types.ts';
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
         [P.ToscaLeggedFrames,P.ToscaLeggedFrames],
         [P.ToscaBracketedFrames,P.ToscaBracketedFrames,P.ToscaBracketedFrames],
         [P.ToscaBracketedFrames,P.ToscaBracketedFrames],
         [P.ToscaBracketedFrames,P.ToscaBracketedFrames,P.ToscaBracketedFrames],
         [P.Tosca0TongueBoards,P.Tosca0TongueBoards,P.Tosca0TongueBoards],
         [P.Tosca0TongueBoards,P.Tosca0TongueBoards,P.Tosca0TongueBoards],
         [P.Tosca0TongueBoards,P.Tosca0TongueBoards,P.Tosca0TongueBoards],
         [P.Tosca2TongueBoards,P.Tosca2TongueBoards,P.Tosca2TongueBoards],
         [P.Tosca2TongueBoards,P.Tosca2TongueBoards,P.Tosca2TongueBoards],
         [P.Tosca2TongueBoards,P.Tosca2TongueBoards,P.Tosca2TongueBoards],
         [P.Tosca3TongueBoards,P.Tosca3TongueBoards,P.Tosca3TongueBoards],
         [P.Tosca3TongueBoards,P.Tosca3TongueBoards,P.Tosca3TongueBoards],
         [P.Tosca3TongueBoards,P.Tosca3TongueBoards,P.Tosca3TongueBoards],
         [P.ToscaLeggedFrames,P.ToscaLeggedFrames,P.ToscaLeggedFrames],
         [P.ToscaLeggedFrames,P.ToscaLeggedFrames,P.ToscaLeggedFrames],
         [P.ToscaLeggedFrames,P.ToscaLeggedFrames,P.ToscaLeggedFrames],
         [P.ToscaShortDblStackedBoards,P.ToscaShortDblStackedBoards],
         [P.ToscaShortDblStackedBoards,P.ToscaSpringBox,P.ToscaShortDblStackedBoards],
         [P.ToscaLeggedFrames,P.ToscaLeggedFrames],
      ]
   })
}