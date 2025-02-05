/* Orientation of pallet. Values are the corresponding length and width in inches; see https://stackoverflow.com/questions/41179474/use-object-literal-as-typescript-enum-values */
export class O {
   static readonly Straight = new O('Straight',48,40)
   static readonly Sideways = new O('Sideways',40,48)
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

export interface Load {
   loadRows: Array<Row>,
}

export interface Named {
   name: String,
}

export enum Side {
   L = "l___",
   C = "_ctr_",
   R = "___r",
}
export type Row = Single | Double
export type Single = {_ctr_: Position}
export type Double = {l___: Position|null, ___r: Position|null}


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

export interface Pallet {
   /* product weight in pounds */
   prdWt: number,
   /* pallet weight in pounds */
   palWt: P,
}

/* Pallet color. Value is the corresponding weight in pounds */
export enum P {
   Chep = 60,
   White = 40,
}

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
   382,
   393,
   408,
   429,
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
   702,
   714,
   716,
   720,
   726,
   729,
   800,
   816,
   850,
   864,
   966,
   972,
   1008,
   1092,
   1134,
   1260,
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