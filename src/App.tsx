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

   type Row = Single | Double
   type Single = {_ctr_: Position}
   type Double = {l___: Position|null, ___r: Position|null}

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

   /* Orientation of pallet. Values are the corresponding length and width in inches */
   type O = Straight | Sideways
   /* see https://stackoverflow.com/questions/41179474/use-object-literal-as-typescript-enum-values */
   class Straight {
      static readonly L = 48
      static readonly W = 40
      private constructor(private readonly key:String, public readonly value:any) {}
      toString() {return this.key}
   }
   /* see https://stackoverflow.com/questions/41179474/use-object-literal-as-typescript-enum-values */
   class Sideways {
      static readonly L = 40
      static readonly W = 48
      private constructor(private readonly key:String, public readonly value:any) {}
      toString() {return this.key}
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
         {l___: {depth: 0, orien: Sideways, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 40, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 40, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 80, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 80, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 120, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 120, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},

         {l___: {depth: 160, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 160, orien: Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 200, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 200, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 240, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 240, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 280, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 280, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

         {l___: {depth: 320, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 320, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 360, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 360, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 400, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 400, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {l___: {depth: 440, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 440, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},

         {l___: {depth: 480, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 480, orien: Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}}
      ]
   }

   useEffect(() => {
      let canvas:HTMLCanvasElement = document.getElementById("load-diagram")! as HTMLCanvasElement
      let ctx = canvas.getContext("2d")
      const fontPx = 7.7;

      ctx.font =  "bold "+(fontPx*zoom)+"px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4

      //ctx.fillStyle = "blue"
      //ctx.beginPath()
      //ctx.rect(0,0,O.Straight*zoom,O.Sideways*zoom)
      //ctx.fill()
      //ctx.stroke()
      //ctx.fillStyle = "white"
      //ctx.fillText("720c", (O.Straight/2)*zoom, (O.Sideways)*zoom)
      //ctx.fillText("720c", (O.Straight/2)*zoom, (O.Sideways-fontPx)*zoom)
      //ctx.fillText("720c", (O.Straight/2)*zoom, (O.Sideways-(2*fontPx))*zoom)
      //ctx.fillText("720c", (O.Straight/2)*zoom, (O.Sideways-(3*fontPx))*zoom)
      //ctx.fillText("720c", (O.Straight/2)*zoom, (O.Sideways-(4*fontPx))*zoom)
      //
      //ctx.fillStyle = "blue"
      //ctx.beginPath()
      //ctx.rect(O.Straight*zoom,0,O.Straight*zoom,O.Sideways*zoom)
      //ctx.fill()
      //ctx.stroke()

      sampleTrailer.loadRows.forEach((row,i) => {
         if ('l___' in row && '___r' in row) {
            if (row.l___ !== null) {
               const l:Position = row.l___
               const depth = zoom * l.depth
               const width = zoom * (l.orien instanceof Straight ? Straight.W : Sideways.W)
               const length = zoom * (l.orien instanceof Straight ? Straight.L : Sideways.L)
               ctx.fillStyle = l.stack[0].palWt === P.Chep ? "mediumblue" : "burlywood"
               ctx.beginPath()
               ctx.rect(0,depth,width,length)
               ctx.fill()
               ctx.stroke()
               ctx.fillStyle = "white"
               l.stack.forEach((pal,j) => {
                  const color = pal.palWt === P.Chep ? "c" : "w"
                  ctx.fillText(pal.prdWt+color, width/2, depth + length - j*fontPx*zoom)
               })
            }
         }
      })
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
         <canvas id={"load-diagram"} width={toInches(8)*zoom} height={toInches(53)*zoom} style={{margin: "20px calc(50% - "+(Straight.L*zoom)+"px)"}}/>
      </>
   )
}

export default App
