/* Orientation of pallet. Values are the corresponding length and width in inches; see https://stackoverflow.com/questions/41179474/use-object-literal-as-typescript-enum-values */
export class O {
   static readonly Straight = new O('Straight',48,40)
   static readonly Sideways = new O('Sideways',40,48)
   private constructor(private readonly key:String, public readonly L:number, public readonly W:number) {}
   toString() {return this.key}
}

export interface Trailer {
   interiorLength: number,
   kingpinDistanceFromNose: number,
   tandemCenterDistanceFromNose: number,
   tandemSpreadWidth: number,
   loadRows: Array<Row>,
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