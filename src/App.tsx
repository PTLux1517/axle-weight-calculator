import {useEffect, useState} from 'react'
import './App.css'


function App() {

   function toInches(feet:number):number {
      return 12*feet;
   }

   function setZoomSlider(newZoom:number) {
      (document.getElementById("zoom-slider") as HTMLInputElement).value = String(newZoom);
   }

   interface Trailer {
      interiorLength: number,
      kingpinDistanceFromNose: number,
      tandemCenterDistanceFromNose: number,
      tandemSpreadWidth: number,
      loadRows: Array<Row>,
   }

   type Row = {_ctr_: Position} | {l___: Position|null, ___r: Position|null}

   interface Position {
      /* front edge distance in inches from the nose */
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

   /* Orientation of pallet. Value is the corresponding length in inches */
   enum O {
      Straight = 48,
      Sideways = 40,
   }

   /* Pallet color. Value is the corresponding weight in pounds */
   enum P {
      Chep = 60,
      White = 40,
   }

   const defaultZoom = 2.5
   const minZoom = 0.5
   const maxZoom = 6.5
   const zoomStep = 0.1
   const [zoom,setZoom] = useState(defaultZoom)

   const sampleTrailer:Trailer = {
      interiorLength: toInches(53),
      kingpinDistanceFromNose: toInches(4),
      tandemCenterDistanceFromNose: toInches(40),
      tandemSpreadWidth: toInches(5),
      loadRows: [
         {l___: {depth: 0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 80, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 80, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 120, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 120, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},

         {l___: {depth: 160, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 160, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 200, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 200, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 240, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 240, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 280, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 280, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

         {l___: {depth: 320, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 320, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 360, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 360, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 400, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 400, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 440, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 440, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

         {l___: {depth: 480, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 480, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}}
      ]
   }

   useEffect(() => {
      let canvas:HTMLCanvasElement = document.getElementById("load-diagram")! as HTMLCanvasElement
      let ctx = canvas.getContext("2d")

      ctx.fillStyle = "blue"
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4
      ctx.rect(0,0,O.Straight*zoom,O.Sideways*zoom)
      ctx.fill()
      ctx.stroke()
      ctx.rect(O.Straight*zoom,0,O.Straight*zoom,O.Sideways*zoom)
      ctx.fill()
      ctx.stroke()
   }, [zoom])

   return (
      <>
         <h1>Axle Weight Calculator</h1>
         <div id={"zoom-div"}>
            <label htmlFor={"zoom"}>zoom</label>
            <hr/>
            <div>
               <button onClick={() => {
                  let newZoom;
                  if (zoom-(5*zoomStep) >= minZoom) newZoom = zoom - (5*zoomStep);
                  else newZoom = minZoom;
                  setZoom(newZoom);
                  setZoomSlider(newZoom);
               }}>-</button>
               <input id={"zoom-slider"} name={"zoom"} type={"range"} defaultValue={defaultZoom} min={minZoom} max={maxZoom} step={zoomStep} onChange={e => setZoom(Number(e.currentTarget.value))}/>
               <button onClick={() => {
                  let newZoom;
                  if (zoom+(5*zoomStep) <= maxZoom) newZoom = zoom + (5*zoomStep);
                  else newZoom = maxZoom;
                  setZoom(newZoom);
                  setZoomSlider(newZoom);
               }}>+</button>
            </div>
            <button onClick={() => {
               setZoom(defaultZoom);
               setZoomSlider(defaultZoom);
            }}>reset</button>
         </div>
         <canvas id={"load-diagram"} width={toInches(8)*zoom} height={toInches(53)*zoom} style={{margin: "20px calc(50% - "+(O.Straight*zoom)+"px)"}}/>
      </>
   )
}

export default App
