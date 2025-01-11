import {ChangeEvent,MouseEvent,useEffect,useState} from 'react'
import './App.css'
import {O,P,Trailer,Position} from './types.ts'
import {toFeet,toInches} from "./calculations.ts";
import {maxLengthStraightTrailer,maxWeightCostcoTrailer} from "./sampleTrailers.ts";


function App() {

   function setZoomSlider(newZoom:number) {
      (document.getElementById("zoom-slider") as HTMLInputElement).value = String(newZoom);
   }

   function resetTrailerDimensionsListener(e:MouseEvent<HTMLButtonElement>) {
      setSampleTrailer(defaultTrailer);
      (document.getElementById("interior-length-in") as HTMLInputElement).value = String(defaultTrailer.interiorLength);
      (document.getElementById("interior-length-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.interiorLength));
      (document.getElementById("kingpin-distance-from-nose-in") as HTMLInputElement).value = String(defaultTrailer.kingpinDistanceFromNose);
      (document.getElementById("kingpin-distance-from-nose-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.kingpinDistanceFromNose));
      (document.getElementById("tandem-spread-width-in") as HTMLInputElement).value = String(defaultTrailer.tandemSpreadWidth);
      (document.getElementById("tandem-spread-width-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.tandemSpreadWidth));
      (document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement).value = String(defaultTrailer.tandemCenterDistanceFromNose);
      (document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.tandemCenterDistanceFromNose));
      (document.getElementById("tandem-slider") as HTMLInputElement).value = String(toFeet(defaultTrailer.tandemCenterDistanceFromNose));
   }

   function interiorLengthListener(e:ChangeEvent<HTMLInputElement>) {
      const newInteriorLength = toInches(Number(e.target?.value))
      setSampleTrailer(prev => {
         let newTrailer:Trailer = {...prev}
         newTrailer.interiorLength = newInteriorLength
         return newTrailer
      })
      const numInputIn= document.getElementById("interior-length-in") as HTMLInputElement
      const numInputFt = document.getElementById("interior-length-ft") as HTMLInputElement
      numInputIn.value = String(newInteriorLength)
      numInputFt.value = String(toFeet(newInteriorLength))
   }

   function kingpinPosListener(e:ChangeEvent<HTMLInputElement>) {
      const newKingpinPos = toInches(Number(e.target?.value))
      setSampleTrailer(prev => {
         let newTrailer:Trailer = {...prev}
         newTrailer.kingpinDistanceFromNose = newKingpinPos
         return newTrailer
      })
      const numInputIn= document.getElementById("kingpin-distance-from-nose-in") as HTMLInputElement
      const numInputFt = document.getElementById("kingpin-distance-from-nose-ft") as HTMLInputElement
      numInputIn.value = String(newKingpinPos)
      numInputFt.value = String(toFeet(newKingpinPos))
   }

   function tandemSpreadWidthListener(e:ChangeEvent<HTMLInputElement>) {
      const newAxleSpread = toInches(Number(e.target?.value))
      setSampleTrailer(prev => {
         let newTrailer:Trailer = {...prev}
         newTrailer.tandemSpreadWidth = newAxleSpread
         return newTrailer
      })
      const numInputIn= document.getElementById("tandem-spread-width-in") as HTMLInputElement
      const numInputFt = document.getElementById("tandem-spread-width-ft") as HTMLInputElement
      numInputIn.value = String(newAxleSpread)
      numInputFt.value = String(toFeet(newAxleSpread))
   }

   function tandemSliderListener(e:ChangeEvent<HTMLInputElement>) {
      const newAxlePos = toInches(Number(e.target?.value))
      setSampleTrailer(prev => {
         let newTrailer:Trailer = {...prev}
         newTrailer.tandemCenterDistanceFromNose = newAxlePos
         return newTrailer
      })
      const numInputIn= document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement
      const numInputFt = document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement
      const rangeInput = document.getElementById("tandem-slider") as HTMLInputElement
      numInputIn.value = String(newAxlePos)
      numInputFt.value = String(toFeet(newAxlePos))
      rangeInput.value = String(toFeet(newAxlePos))
   }

   const defaultZoom = 1.5
   const minZoom = 0.5
   const maxZoom = 6.5
   const zoomStep = 0.1
   const [zoom,setZoom] = useState(defaultZoom)

   const defaultTrailer:Trailer = maxWeightCostcoTrailer
   const [sampleTrailer, setSampleTrailer] = useState<Trailer>(defaultTrailer)

   const frontTandAxlePos = zoom * (sampleTrailer.tandemCenterDistanceFromNose - sampleTrailer.tandemSpreadWidth/2)
   const rearTandAxlePos = zoom * (sampleTrailer.tandemCenterDistanceFromNose + sampleTrailer.tandemSpreadWidth/2)

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

      /* redraw trailer background */
      ctx.fillStyle = "grey"
      ctx.fillRect(0,0,zoom*toInches(8),zoom*sampleTrailer.interiorLength)

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
      ctx.strokeRect(zoom*39,frontTandAxlePos-(axleThickness/2),axleWidth,axleThickness)
      ctx.strokeRect(zoom*39,rearTandAxlePos-(axleThickness/2),axleWidth,axleThickness)

   }, [zoom, sampleTrailer])

   return (
      <>
         <h1>Axle Weight Calculator</h1>
         <main>
            {/* ----------------------------------------------------------------- COLUMN 1 ----------------------------------------------------------------- */}
            <div id={"unloaded-weight-container"} style={{gridRow: 1, gridColumn: 1}}>
               <h3>Unloaded Weight (lbs)</h3>
            </div>
            <div id={"loaded-weight-container"} style={{gridRow: 2, gridColumn: 1}}>
               <h3>Loaded Weight (lbs)</h3>
               <div id={"drive-weight"} style={{top: zoom*sampleTrailer.kingpinDistanceFromNose - 35}}>Drive axles:<br/>{} / {}</div>
               <div id={"front-tandem-weight"} style={{top: frontTandAxlePos - 35}}>Trailer axle:<br/>{} / {}</div>
               <div id={"rear-tandem-weight"} style={{top: rearTandAxlePos - 35}}>Trailer axle:<br/>{} / {}</div>
               <div id={"combined-weight"} style={{top: zoom*sampleTrailer.interiorLength - 70}}>Combined:<br/>{} / 80,000</div>
            </div>
            {/* ----------------------------------------------------------------- COLUMN 2 ----------------------------------------------------------------- */}
            <div id={"zoom-container"} style={{gridRow: 1, gridColumn: 2}}>
               <label id={"zoom-label"} htmlFor={"zoom"}>Zoom Diagram</label>
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
            <canvas id={"load-diagram"} className={"no-border"} width={toInches(8)*zoom} height={sampleTrailer.interiorLength*zoom} style={{margin: "0 calc(50% - "+(toInches(4)*zoom)+"px)", gridRow: 2, gridColumn: 2}}/>
            {/* ----------------------------------------------------------------- COLUMN 3 ----------------------------------------------------------------- */}
            <div id={"trailer-dimensions-container"} style={{gridRow: 1, gridColumn: 3}}>
               <h3 style={{gridColumn: "1/4"}}>Trailer Dimensions</h3>
               <button onClick={resetTrailerDimensionsListener}>reset</button>
               <div style={{gridColumn: 2}}>in</div>
               <div style={{gridColumn: 3}}>ft</div>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"interior-length-in"}>Interior Length</label>
               <input style={{gridColumn: 2}} type={"number"} id={"interior-length-in"} name={"interior-length-in"} disabled defaultValue={sampleTrailer.interiorLength}/>
               <input style={{gridColumn: 3}} type={"number"} id={"interior-length-ft"} name={"interior-length-ft"} step={0.5} min={48} max={53} defaultValue={toFeet(sampleTrailer.interiorLength)} onChange={interiorLengthListener}/>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"kingpin-distance-from-nose-in"}>Drive Axles Center Distance From Nose</label>
               <input style={{gridColumn: 2}} type={"number"} id={"kingpin-distance-from-nose-in"} name={"kingpin-distance-from-nose-in"} disabled defaultValue={sampleTrailer.kingpinDistanceFromNose}/>
               <input style={{gridColumn: 3}} type={"number"} id={"kingpin-distance-from-nose-ft"} name={"kingpin-distance-from-nose-ft"} step={0.5} min={1} max={8} defaultValue={toFeet(sampleTrailer.kingpinDistanceFromNose)} onChange={kingpinPosListener}/>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"tandem-spread-width-in"}>Tandem Spread Width</label>
               <input style={{gridColumn: 2}} type={"number"} id={"tandem-spread-width-in"} name={"tandem-spread-width-in"} disabled defaultValue={sampleTrailer.tandemSpreadWidth}/>
               <input style={{gridColumn: 3}} type={"number"} id={"tandem-spread-width-ft"} name={"tandem-spread-width-ft"} step={0.5} min={3} max={20} defaultValue={toFeet(sampleTrailer.tandemSpreadWidth)} onChange={tandemSpreadWidthListener}/>
               <label style={{gridColumn: 1}} htmlFor={"tandem-center-distance-from-nose-in"}>Tandem Center Distance From Nose</label>
               <input style={{gridColumn: 2}} type={"number"} id={"tandem-center-distance-from-nose-in"} name={"tandem-center-distance-from-nose-in"} disabled defaultValue={sampleTrailer.tandemCenterDistanceFromNose}/>
               <input style={{gridColumn: 3}} type={"number"} id={"tandem-center-distance-from-nose-ft"} name={"tandem-center-distance-from-nose-ft"} step={0.5} min={36} max={48} defaultValue={toFeet(sampleTrailer.tandemCenterDistanceFromNose)} onChange={tandemSliderListener}/>
               <input style={{gridColumn: "1/4"}} type={"range"} id={"tandem-slider"} step={0.5} min={36} max={48} defaultValue={toFeet(sampleTrailer.tandemCenterDistanceFromNose)} onChange={tandemSliderListener}/>
            </div>
            <div id={"editor-container"} style={{gridRow: 2, gridColumn: 3}}>
               <h3>Edit Pallet/Load</h3>
            </div>
         </main>
      </>
   )
}

export default App
