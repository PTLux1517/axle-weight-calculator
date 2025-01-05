import {useEffect, useState} from 'react'
import './App.css'


function App() {

   interface Trailer {
      interiorLength: number,
      kingpinDistanceFromNose: number,
      tandemCenterDistanceFromNose: number,
      tandemSpreadWidth: number,
      loadRows: Array<Row>,
   }

   type Row = {_ctr_: Position} | {l___: Position|null, ___r: Position|null}

   interface Position {
      /* front edge distance in feet from the nose */
      depth: number,
      /* orientation of pallet (stack) */
      orien: O,
      /* stack of arbitrary number of pallets. array index corresponds to position off the ground, i.e. bottom/single is 0, first stacked pallet is 1, and so on */
      stack: Array<Pallet>,
   }

   interface Pallet {
      /* product weight in pounds */
      prdWt: number,
      /* pallet weight in pounds */
      palWt: P,
   }

   /* Orientation of pallet. Value is the corresponding length in feet */
   enum O {
      Straight = 4.0,
      Sideways = 3.5,
   }

   /* Pallet color. Value is the corresponding weight in pounds */
   enum P {
      Chep = 60,
      White = 40,
   }


   const [zoom,setZoom] = useState(1.0)

   const sampleTrailer:Trailer = {
      interiorLength: 53,
      kingpinDistanceFromNose: 4,
      tandemCenterDistanceFromNose: 40,
      tandemSpreadWidth: 5,
      loadRows: [
         {l___: {depth: 0.0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0.0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 3.5, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 3.5, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 7.0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 7.0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 10.5, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 10.5, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},

         {l___: {depth: 14.0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 14.0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 17.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 17.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 21.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 21.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 24.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 24.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

         {l___: {depth: 28.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 28.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 31.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 31.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 35.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 35.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 38.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 38.5, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

         {l___: {depth: 42.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 42.0, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}}
      ]
   }

   useEffect(() => {
      let canvas:HTMLCanvasElement = document.getElementById("load-diagram")! as HTMLCanvasElement
      let ctx = canvas.getContext("2d")

      ctx.fillStyle = "blue"
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4
      ctx.rect(0,0,120*zoom,100*zoom)
      ctx.fill()
      ctx.stroke()
   }, [zoom])

   return (
      <>
         <h1>Axle Weight Calculator</h1>
         <label htmlFor={"zoom"}>zoom: </label>
         <input name={"zoom"} type={"range"} defaultValue={1.0} min={0.1} max={5.0} step={0.1} onChange={e => setZoom(Number(e.currentTarget.value))}></input>
         <button onClick={() => setZoom(1.0)}>reset</button>
         <canvas id={"load-diagram"} width={240*zoom} height={1590*zoom} style={{margin: "20px calc(50% - "+(120*zoom)+"px)"}}></canvas>
      </>
   )
}

export default App
