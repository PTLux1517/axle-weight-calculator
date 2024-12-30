import {useState} from 'react'
import './App.css'


function App() {

   interface Trailer {
      length: number,
      kingpinOffsetFromNose: number,
      axlePositionFromNose: number, //midpoint between rear tandems or spread
      axleSpread: number,
      load: Array<Row>,
   }

   type Row = [Position] | [Position|null,Position|null] //center OR both L + R

   interface Position {
      frontEdgeDistanceFromNose: number, //feet
      orientation: PalletOrientation,
      stack: Array<Pallet>,
   }

   interface Pallet {
      productWeight: number,
      palletWeight: PalletWeight,
   }

   enum PalletOrientation {
      Straight = 4.0, //feet
      Sideways = 3.5, //feet
   }

   enum PalletWeight {
      Chep = 60,  //pounds
      White = 40, //pounds
   }

   return (
      <>
         <h1>Axle Weight Calculator</h1>

      </>
   )
}

export default App
