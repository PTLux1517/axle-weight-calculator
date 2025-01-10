import {useEffect, useState} from 'react'
import './App.css'

/* Orientation of pallet. Values are the corresponding length and width in inches; see https://stackoverflow.com/questions/41179474/use-object-literal-as-typescript-enum-values */
export class O {
   static readonly Straight = new O('Straight',48,40)
   static readonly Sideways = new O('Sideways',40,48)
   private constructor(private readonly key:String, public readonly L:number, public readonly W:number) {}
   toString() {return this.key}
}


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
      interiorLength: toInches(51),
      kingpinDistanceFromNose: toInches(4),
      tandemCenterDistanceFromNose: toInches(40),
      tandemSpreadWidth: toInches(5),
      loadRows: [
         {l___: {depth: 0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 0, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
         {l___: {depth: 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}, ___r: {depth: 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.Chep}, {prdWt: 720, palWt: P.Chep}]}},
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

         {l___: {depth: 480, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}, ___r: {depth: 480, orien: O.Sideways, stack: [{prdWt: 1560, palWt: P.Chep}]}},
         {_ctr_: {depth: 520, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}]}},
         {_ctr_: {depth: 560, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}]}}
      ]
   }

   //const sampleTrailer:Trailer = {
   //   interiorLength: toInches(51),
   //   kingpinDistanceFromNose: toInches(4),
   //   tandemCenterDistanceFromNose: toInches(40),
   //   tandemSpreadWidth: toInches(5),
   //   loadRows: [
   //      {_ctr_: {depth: 48*0, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*1, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*2, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*3, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //
   //      {_ctr_: {depth: 48*4, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*5, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*6, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*7, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //
   //      {_ctr_: {depth: 48*8, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*9, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*10, orien: O.Straight, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //      {_ctr_: {depth: 48*11, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //
   //      {_ctr_: {depth: 48*11 + 40, orien: O.Sideways, stack: [{prdWt: 720, palWt: P.White}, {prdWt: 720, palWt: P.Chep}]}},
   //
   //   ]
   //}

   useEffect(() => {
      let canvas:HTMLCanvasElement = document.getElementById("load-diagram")! as HTMLCanvasElement
      let ctx = canvas.getContext("2d")
      const fontPx = 7.7
      const thirdLength = zoom * (sampleTrailer.tandemCenterDistanceFromNose/3)

      ctx.font =  "bold "+(fontPx*zoom)+"px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4

      /* draw pallets */
      sampleTrailer.loadRows.forEach((row,i) => {
         if ('l___' in row && '___r' in row) {
            if (row.l___ !== null) {
               const l:Position = row.l___
               const depth = zoom * l.depth
               const width = zoom * (String(l.orien) === String(O.Straight) ? O.Straight.W : O.Sideways.W)
               const length = zoom * (String(l.orien) === String(O.Straight) ? O.Straight.L : O.Sideways.L)
               /* draw pallet */
               ctx.fillStyle = l.stack[0].palWt === P.Chep ? "mediumblue" : "burlywood"
               ctx.beginPath()
               ctx.rect(0,depth,width,length)
               ctx.fill()
               ctx.stroke()
               /* draw row number */
               ctx.save()
               ctx.fillStyle = thirdLength <= depth && depth < 2*thirdLength ? "red" : "black"
               ctx.translate(10*zoom, depth + length/2)
               ctx.rotate(-Math.PI/2)
               ctx.fillText("R"+(i+1), 0, 0)
               ctx.restore()
               /* draw (stacked) pallet weights */
               ctx.fillStyle = "white"
               l.stack.forEach((pal,j) => {
                  const color = pal.palWt === P.Chep ? "c" : "w"
                  ctx.fillText(pal.prdWt+color, width/2, depth + length - j*fontPx*zoom)
               })
            }
            if (row.___r !== null) {
               const r:Position = row.___r
               const depth = zoom * r.depth
               const width = zoom * (String(r.orien) === String(O.Straight) ? O.Straight.W : O.Sideways.W)
               const length = zoom * (String(r.orien) === String(O.Straight) ? O.Straight.L : O.Sideways.L)
               /* draw pallet */
               ctx.fillStyle = r.stack[0].palWt === P.Chep ? "mediumblue" : "burlywood"
               ctx.beginPath()
               ctx.rect(zoom*toInches(8)-width,depth,width,length)
               ctx.fill()
               ctx.stroke()
               /* draw row number */
               ctx.save()
               ctx.fillStyle = thirdLength <= depth && depth < 2*thirdLength ? "red" : "black"
               ctx.translate(zoom*toInches(8) - 10*zoom, depth + length/2)
               ctx.rotate(Math.PI/2)
               ctx.fillText("R"+(i+1), 0, 0)
               ctx.restore()
               /* draw (stacked) pallet weights */
               ctx.fillStyle = "white"
               r.stack.forEach((pal,j) => {
                  const color = pal.palWt === P.Chep ? "c" : "w"
                  ctx.fillText(pal.prdWt+color, zoom*toInches(8) - width/2, depth + length - j*fontPx*zoom)
               })
            }
         }
         else if ('_ctr_' in row) {
            const c:Position = row._ctr_
            const depth = zoom * c.depth
            const width = zoom * (String(c.orien) === String(O.Straight) ? O.Straight.W : O.Sideways.W)
            const length = zoom * (String(c.orien) === String(O.Straight) ? O.Straight.L : O.Sideways.L)
            /* draw pallet */
            ctx.fillStyle = c.stack[0].palWt === P.Chep ? "mediumblue" : "burlywood"
            ctx.beginPath()
            ctx.rect(zoom*toInches(4) - width/2,depth,width,length)
            ctx.fill()
            ctx.stroke()
            /* draw row number */
            ctx.save()
            ctx.fillStyle = thirdLength <= depth && depth < 2*thirdLength ? "red" : "black"
            ctx.translate(10*zoom, depth + length/2)
            ctx.rotate(-Math.PI/2)
            ctx.fillText("R"+(i+1), 0, 0)
            ctx.restore()
            ctx.save()
            ctx.fillStyle = thirdLength <= depth && depth < 2*thirdLength ? "red" : "black"
            ctx.translate(zoom*toInches(8) - 10*zoom, depth + length/2)
            ctx.rotate(Math.PI/2)
            ctx.fillText("R"+(i+1), 0, 0)
            ctx.restore()
            /* draw (stacked) pallet weights */
            ctx.fillStyle = "white"
            c.stack.forEach((pal,j) => {
               const color = pal.palWt === P.Chep ? "c" : "w"
               ctx.fillText(pal.prdWt+color, zoom*toInches(4), depth + length - j*fontPx*zoom)
            })
         }
      })

      /* draw kingpin */
      ctx.strokeStyle = "dimgray"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(zoom*toInches(4),zoom*sampleTrailer.kingpinDistanceFromNose,zoom*2,0,2*Math.PI)
      ctx.stroke()

      /* draw axles */
      const axleThickness = zoom * 5
      const axleWidth = zoom * 18
      const frontTandAxlePos = zoom * (sampleTrailer.tandemCenterDistanceFromNose - sampleTrailer.tandemSpreadWidth/2)
      const rearTandAxlePos = zoom * (sampleTrailer.tandemCenterDistanceFromNose + sampleTrailer.tandemSpreadWidth/2)
      ctx.strokeRect(zoom*39,frontTandAxlePos-(axleThickness/2),axleWidth,axleThickness)
      ctx.strokeRect(zoom*39,rearTandAxlePos-(axleThickness/2),axleWidth,axleThickness)

   }, [zoom, sampleTrailer])

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
         <canvas id={"load-diagram"} width={toInches(8)*zoom} height={sampleTrailer.interiorLength*zoom} style={{margin: "20px calc(50% - "+(O.Straight.L*zoom)+"px)"}}/>
      </>
   )
}

export default App
