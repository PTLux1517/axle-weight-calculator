export function toInches(feet:number):number {
   return 12*feet;
}

export function toFeet(inches:number):number {
   return Math.round(2*inches/12.0)/2;
}