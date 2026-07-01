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

/* Orientation of pallet. Values are the corresponding length and width in inches; see https://stackoverflow.com/questions/41179474/use-object-literal-as-typescript-enum-values */
export class O {
   static readonly Straight = new O('Straight',48,40)
   static readonly Sideways = new O('Sideways',40,48)
   static readonly ToscaSm = new O('ToscaSm',24,30)
   static readonly ToscaLg = new O('ToscaLg',30,30)
   private constructor(public readonly text:String, public readonly L:number, public readonly W:number) {}
   toString() {return this.text}
}

export interface AxleWeights {
   steers: number,
   drives: number,
   fTandem: number,
   rTandem: number,
}

export interface Trailer {
   interiorLength: number,
   kingpinDistanceFromNose: number,
   tandemCenterDistanceFromNose: number,
   tandemSpreadWidth: number,
}

export interface Named {
   name: String,
}

export interface Load {
   rows: Array<Row>,
}

export type Row = Single | Double | Triple
export type Single = {_C_: Position}
export type Double = {L__: Position|null, __R: Position|null}
export type Triple = Single & Double

export interface Position {
   /* front edge distance in inches from the nose */
   depth: number,
   /* orientation of pallet (stack) */
   orien: O,
   /* stack of arbitrary number of pallets. array index corresponds to position off the ground, i.e. bottom/single is 0, first stacked pallet is 1, and so on */
   stack: Array<Pallet>,

}
export interface PositionWithMeta extends Position {
   row: number,
   side: Side,
}
export enum Side {
   L = "L__",
   C = "_C_",
   R = "__R",
}

export interface Pallet {
   /* product weight in pounds */
   prdWt?: number,
   /* pallet weight in pounds */
   palWt: P,
}

/* Pallet color. Value is the corresponding weight in pounds */
export enum P {
   Chep         = 60,
   White        = 40,
   TBrackets    = 398, //top irons
   TLegs        = 461, //bottom irons
   TShortSingle = 378, //pressure plate boards (as single)
   TShortStacks = 756, //pressure plate boards (as stack)
   T0Tabs       = 874, //top and bottom boards
   TSprings     = 981, //springs
   T2Tabs       = 986, //narrow side boards
   T3Tabs       = 1272, //wide side boards
}

export interface LoadTemplate {
   rows: Array<TRowOrd>|Array<TRowTosca>, //ordinary or tosca templates
}
export type TRowOrd = [RO,TSingle|TDouble]
export type TRowTosca = [P,P]|[P,P,P]
/* Row Orientation */
export enum RO {
   ST = "ST", //straight
   SD = "SD", //sideways
   C1 = "C1", //chimney 1 (straight right)
   C2 = "C2", //chimney 2 (straight left)
}
export type TSingle = [TPos]
export type TDouble = [TPos,TPos]
export type TPos = P                 //empty pallet
                 | [P]               //stack of empty pallets
                 | [number,P]        //prdWt and palWt for singles
                 | [number,Array<P>] //prdWts and palWts for stacks; ex: [972+393+100,[P.Chep,P.White,P.White]]; convention is bottom pallet first then up

export interface StagedStackWithMeta {
   stack:Pallet[],
   stagedIdx:number,
}

export type SlideAxleNoRestrictionMaxLength = 46.5
export type SlideAxleRestrictionMaxLength = 40|41|43|45.5

export interface SlideAxleRestriction {
   state: State,
   kingpinToTandemMaxLength: SlideAxleRestrictionMaxLength|SlideAxleNoRestrictionMaxLength,
   measurementReference: AxleReferencePoint,
}

/* State abbreviation */
export enum State {
   AL = "Alabama",
   AK = "Alaska",
   AZ = "Arizona",
   AR = "Arkansas",
   CA = "California",
   CO = "Colorado",
   CT = "Connecticut",
   DE = "Delaware",
   FL = "Florida",
   GA = "Georgia",
   HI = "Hawaii",
   ID = "Idaho",
   IL = "Illinois",
   IN = "Indiana",
   IA = "Iowa",
   KS = "Kansas",
   KY = "Kentucky",
   LA = "Louisiana",
   ME = "Maine",
   MD = "Maryland",
   MA = "Massachusetts",
   MI = "Michigan",
   MN = "Minnesota",
   MS = "Mississippi",
   MO = "Missouri",
   MT = "Montana",
   NE = "Nebraska",
   NV = "Nevada",
   NH = "New_Hampshire",
   NJ = "New_Jersey",
   NM = "New_Mexico",
   NY = "New_York",
   NC = "North_Carolina",
   ND = "North_Dakota",
   OH = "Ohio",
   OK = "Oklahoma",
   OR = "Oregon",
   PA = "Pennsylvania",
   RI = "Rhode_Island",
   SC = "South_Carolina",
   SD = "South_Dakota",
   TN = "Tennessee",
   TX = "Texas",
   UT = "Utah",
   VT = "Vermont",
   VA = "Virginia",
   WA = "Washington",
   WV = "West_Virginia",
   WI = "Wisconsin",
   WY = "Wyoming",
}

export enum AxleReferencePoint {
   Ctr = "to tandem center",
   Rear = "to rear axle",
}

export enum RearAxleTypeCapacity {
   Tandem = 17000,
   Spread = 20000,
}

export const trailerWeightEmptyMinusAxlesAndReefer = 9000

export const placeholderPosition = {depth: 0, orien: O.Straight, stack: []} as Position

export const fgPalletWeights = [
   0, //tosca
   280,
   382,
   393,
   //398, //tosca top irons
   408,
   429,
   //461, //tosca bottom irons
   468,
   472,
   500,
   511,
   526,
   567,
   585,
   624,
   630,
   648,
   649,
   658,
   702,
   714,
   716,
   720,
   726,
   729,
   //756, //tosca pressure plates
   800,
   816,
   850,
   864,
   //874, //tosca top|bottom boards
   966,
   972,
   981, //tosca springs
   986, //tosca narrow sides
   1008,
   1092,
   1134,
   1260,
   //1272, //tosca wide sides
   1280,
   1287,
   1350,
   1428,
   1440,
   1488,
   1519,
   1530,
   1560,
   1656,
   1680,
   1728,
   1740,
   1800,
   1836,
   1890,
   1920,
   1944,
   2000,
   2028,
   2160,
   2184,
   2240,
]