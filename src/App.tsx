import {ChangeEvent,MouseEvent,useEffect,useState} from 'react'
import './App.css'
import {AxleReferencePoint,AxleWeights,Double,Load,O,P,Position,PositionWithMeta,RearAxleTypeCapacity,Side,Single,State,Trailer} from './types.ts'
import {
   calcAxleWeights,
   getStateTandemMaxLength,
   getStateTandemMeasurementReference,recalcDepths,
   rotatePosition,
   stateRefDistanceToAxleDistanceFromNose,
   tandemCenterDistanceFromNoseToStateRefDistance,
   toFeet,
   toInches,totalGrossWt,totalLoadWt,
   toTitleCase
} from "./calculations.ts";
import {maxWeightCostcoTrailer,minSlideTrailer,minTandCenterSlideLengthFromNose} from "./sampleTrailers.ts";
import {slideAxleRestrictedStates,SlideAxleRestrictionsDivider,unrestrictedLength,unrestrictedReference} from "./slideAxleRestrictedStates.ts";


function App() {

   function setZoomSlider(newZoom:number) {
      (document.getElementById("zoom-slider") as HTMLInputElement).value = String(newZoom);
   }

   function resetTrailerDimensionsListener() {
      setSampleTrailer(defaultTrailer);
      setStateRestriction(defaultState);
      setRearAxleTypeCapacity(defaultRearAxleType);
      (document.getElementById("interior-length-in") as HTMLInputElement).value = String(defaultTrailer.interiorLength);
      (document.getElementById("interior-length-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.interiorLength));
      (document.getElementById("kingpin-distance-from-nose-in") as HTMLInputElement).value = String(defaultTrailer.kingpinDistanceFromNose);
      (document.getElementById("kingpin-distance-from-nose-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.kingpinDistanceFromNose));
      (document.getElementById("tandem-spread-width-in") as HTMLInputElement).value = String(defaultTrailer.tandemSpreadWidth);
      (document.getElementById("tandem-spread-width-ft") as HTMLInputElement).value = String(toFeet(defaultTrailer.tandemSpreadWidth));
      (document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement).value = String(tandemCenterDistanceFromNoseToStateRefDistance(defaultTrailer, defaultState));
      (document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement).value = String(toFeet(tandemCenterDistanceFromNoseToStateRefDistance(defaultTrailer, defaultState)));
      (document.getElementById("tandem-slider") as HTMLInputElement).value = String(toFeet(tandemCenterDistanceFromNoseToStateRefDistance(defaultTrailer, defaultState)));
      (document.getElementById("destination-state") as HTMLInputElement).value = (document.getElementById("opt-"+defaultState) as HTMLOptionElement).value;
   }

   function interiorLengthListener(e:ChangeEvent<HTMLInputElement>) {
      const newInteriorLength = toInches(Number(e.target?.value))
      setSampleTrailer(prev => {
         let newTrailer:Trailer&Load = {...prev} //shallow copy; works here but avoid use elsewhere
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
      let newTrailer:Trailer&Load = {...sampleTrailer} //shallow copy; works here but avoid use elsewhere
      newTrailer.kingpinDistanceFromNose = newKingpinPos
      const newRefPos = tandemCenterDistanceFromNoseToStateRefDistance(newTrailer,stateRestriction)
      setSampleTrailer(newTrailer)
      const numInputIn= document.getElementById("kingpin-distance-from-nose-in") as HTMLInputElement
      const numInputFt = document.getElementById("kingpin-distance-from-nose-ft") as HTMLInputElement
      const tandNumInputIn= document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement
      const tandNumInputFt = document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement
      const rangeInput = document.getElementById("tandem-slider") as HTMLInputElement
      numInputIn.value = String(newKingpinPos)
      numInputFt.value = String(toFeet(newKingpinPos))
      tandNumInputIn.value = String(newRefPos)
      tandNumInputFt.value = String(toFeet(newRefPos))
      rangeInput.value = String(toFeet(newRefPos))
   }

   function tandemSpreadWidthListener(e:ChangeEvent<HTMLInputElement>) {
      const newAxleSpread = toInches(Number(e.target?.value))
      setSampleTrailer(prev => {
         let newTrailer:Trailer&Load = {...prev} //shallow copy; works here but avoid use elsewhere
         newTrailer.tandemSpreadWidth = newAxleSpread
         let tandemCenterRepositioned = false
         let difference = minTandCenterSlideLengthFromNose - newTrailer.tandemCenterDistanceFromNose
         if (difference > 0) {
            newTrailer.tandemCenterDistanceFromNose += Math.ceil(difference/6.0)*6
            tandemCenterRepositioned = true
         }
         let newRefPos = tandemCenterDistanceFromNoseToStateRefDistance(newTrailer,stateRestriction)
         const stateMax = toInches(getStateTandemMaxLength(stateRestriction))
         difference = newRefPos - stateMax
         if (difference > 0) { //rear axle too far back
            newTrailer.tandemCenterDistanceFromNose -= Math.ceil(difference/6.0)*6
            tandemCenterRepositioned = true
         }
         if (getStateTandemMeasurementReference(stateRestriction)===AxleReferencePoint.Rear) {
            const numInputIn= document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement
            const numInputFt = document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement
            const rangeInput = document.getElementById("tandem-slider") as HTMLInputElement
            if (tandemCenterRepositioned) {
               newRefPos = tandemCenterDistanceFromNoseToStateRefDistance(newTrailer,stateRestriction)
            }
            numInputIn.value = String(newRefPos)
            numInputFt.value = String(toFeet(newRefPos))
            rangeInput.value = String(toFeet(newRefPos))
         }
         return newTrailer
      })
      const numInputIn= document.getElementById("tandem-spread-width-in") as HTMLInputElement
      const numInputFt = document.getElementById("tandem-spread-width-ft") as HTMLInputElement
      numInputIn.value = String(newAxleSpread)
      numInputFt.value = String(toFeet(newAxleSpread))
      setRearAxleTypeCapacity(newAxleSpread > 96 ? RearAxleTypeCapacity.Spread : RearAxleTypeCapacity.Tandem)
   }

   function tandemSliderListener(e:ChangeEvent<HTMLInputElement>) {
      const input = e.target?.value
      if (input===undefined) return;
      const inputInches = toInches(Number(input))
      const newRearAxlePos = stateRefDistanceToAxleDistanceFromNose("R", sampleTrailer, inputInches, stateRestriction)
      const newTandCenterPos = newRearAxlePos - sampleTrailer.tandemSpreadWidth/2
      setSampleTrailer(prev => {
         let newTrailer:Trailer&Load = {...prev} //shallow copy; works here but avoid use elsewhere
         newTrailer.tandemCenterDistanceFromNose = newTandCenterPos
         return newTrailer
      })
      const numInputIn= document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement
      const numInputFt = document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement
      const rangeInput = document.getElementById("tandem-slider") as HTMLInputElement
      numInputIn.value = String(inputInches)
      numInputFt.value = String(toFeet(inputInches))
      rangeInput.value = String(toFeet(inputInches))
   }

   function destinationStateListener(e:ChangeEvent<HTMLSelectElement>) {
      const raw = e.target.value
      const newState = raw==="No restrictions"
         ? null
         : raw.slice(0,raw.indexOf(" ")) as State
      const newMaxSlide = newState===null ? unrestrictedLength : getStateTandemMaxLength(newState)
      setStateRestriction(newState)
      setMaxSlide(newMaxSlide)
      setSampleTrailer(prev => {
         let newTrailer:Trailer&Load = {...prev} //shallow copy; works here but avoid use elsewhere
         newTrailer.tandemCenterDistanceFromNose = stateRefDistanceToAxleDistanceFromNose("R",newTrailer,toInches(newMaxSlide),newState) - newTrailer.tandemSpreadWidth/2
         return newTrailer
      })
      const numInputIn= document.getElementById("tandem-center-distance-from-nose-in") as HTMLInputElement
      const numInputFt = document.getElementById("tandem-center-distance-from-nose-ft") as HTMLInputElement
      const rangeInput = document.getElementById("tandem-slider") as HTMLInputElement
      numInputIn.value = String(toInches(newMaxSlide))
      numInputFt.value = String(newMaxSlide)
      setTimeout(() => rangeInput.value = String(newMaxSlide),10)
   }

   function canvasClickListener(e: MouseEvent) {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
      const x = Math.round((e.clientX - rect.left)/zoom)
      const y = Math.round((e.clientY - rect.top)/zoom)
      //console.log("("+x+","+y+")")
      const side:Side = x <= toInches(4) ? Side.L : Side.R;
      sampleTrailer.loadRows.forEach((row, i) => {
         if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
            row = row as Double
            if (side===Side.L && row.l___!==null && row.l___.depth<=y && y<(row.l___.depth + row.l___.orien.L)) {
               if (selectedPosition1===null) setSelectedPosition1({row: (i+1), side: Side.L, ...row.l___})
               else if (selectedPosition2===null) setSelectedPosition2({row: (i+1), side: Side.L, ...row.l___})
            }
            if (side===Side.R && row.___r !== null && row.___r.depth<=y && y<(row.___r.depth + row.___r.orien.L)) {
               if (selectedPosition1===null) setSelectedPosition1({row: (i+1), side: Side.R, ...row.___r})
               else if (selectedPosition2===null) setSelectedPosition2({row: (i+1), side: Side.R, ...row.___r})
            }
         }
         else if (row.hasOwnProperty(Side.C)) {
            row = row as Single
            if (row._ctr_.depth<= y && y<(row._ctr_.depth + row._ctr_.orien.L)) {
               if (selectedPosition1===null) setSelectedPosition1({row: (i+1), side: Side.C, ...row._ctr_})
               else if (selectedPosition2===null) setSelectedPosition2({row: (i+1), side: Side.C, ...row._ctr_})
            }
         }
      });
   }

   //const forceUpdate = useReducer(x => x+1, 0, () => 0)[1]
   const defaultZoom = 1.5
   const minZoom = 0.5
   const maxZoom = 6.5
   const zoomStep = 0.1
   const [zoom,setZoom] = useState(defaultZoom)
   const [selectedPosition1, setSelectedPosition1] = useState<PositionWithMeta|null>(null)
   const [selectedPosition2, setSelectedPosition2] = useState<PositionWithMeta|null>(null)

   const defaultTrailer:Trailer&Load = maxWeightCostcoTrailer
   const defaultState:State = State.CA
   const defaultRearAxleType:RearAxleTypeCapacity = RearAxleTypeCapacity.Tandem
   const defaultUnloadedWeights:AxleWeights = {
      steers: 12000,
      drives: 15000,
      fTandem: 5000,
      rTandem: 5000,
   }
   const [sampleTrailer, setSampleTrailer] = useState<Trailer&Load>(defaultTrailer)
   const [stateRestriction, setStateRestriction] = useState<State|null>(defaultState)
   const [maxSlide, setMaxSlide] = useState(getStateTandemMaxLength(defaultState))
   const [rearAxleTypeCapacity, setRearAxleTypeCapacity] = useState<RearAxleTypeCapacity>(defaultRearAxleType)
   const [unloaded, setUnloaded] = useState<AxleWeights>(defaultUnloadedWeights)
   const [loaded, setLoaded] = useState<AxleWeights|null>(null)

   useEffect(() => {
      setLoaded(calcAxleWeights(sampleTrailer,unloaded,rearAxleTypeCapacity))
   },[sampleTrailer]);

   const frontTandAxleRenderPos = zoom * (sampleTrailer.tandemCenterDistanceFromNose - sampleTrailer.tandemSpreadWidth/2)
   const rearTandAxleRenderPos = zoom * (sampleTrailer.tandemCenterDistanceFromNose + sampleTrailer.tandemSpreadWidth/2)

   useEffect(() => {
      let canvas:HTMLCanvasElement = document.getElementById("load-diagram")! as HTMLCanvasElement
      let ctx = canvas.getContext("2d")
      const fontPx = 7.7
      const thirdLength = zoom * (sampleTrailer.tandemCenterDistanceFromNose/3)

      if (ctx===null) return;

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
         if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
            row = row as Double
            if (row.l___ !== null) {
               const l:Position = row.l___
               const depth = zoom * l.depth
               const width = zoom * (l.orien.text === O.Straight.text ? O.Straight.W : O.Sideways.W)
               const length = zoom * (l.orien.text === O.Straight.text ? O.Straight.L : O.Sideways.L)
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
               const width = zoom * (r.orien.text === O.Straight.text ? O.Straight.W : O.Sideways.W)
               const length = zoom * (r.orien.text === O.Straight.text ? O.Straight.L : O.Sideways.L)
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
         else if (row.hasOwnProperty(Side.C)) {
            row = row as Single
            const c:Position = row._ctr_
            const depth = zoom * c.depth
            const width = zoom * (c.orien.text === O.Straight.text ? O.Straight.W : O.Sideways.W)
            const length = zoom * (c.orien.text === O.Straight.text ? O.Straight.L : O.Sideways.L)
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
      });

      /* draw kingpin */
      ctx.strokeStyle = "dimgray"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(zoom*toInches(4),zoom*sampleTrailer.kingpinDistanceFromNose,zoom*2,0,2*Math.PI)
      ctx.stroke()

      /* draw axles */
      const axleThickness = zoom * 5
      const axleWidth = zoom * 18
      ctx.strokeRect(zoom*39,frontTandAxleRenderPos-(axleThickness/2),axleWidth,axleThickness)
      ctx.strokeRect(zoom*39,rearTandAxleRenderPos-(axleThickness/2),axleWidth,axleThickness)

   }, [zoom, sampleTrailer])

   return (
      <>
         <h1>Axle Weight Calculator</h1>
         <main>
            {/* ----------------------------------------------------------------- COLUMN 1 ----------------------------------------------------------------- */}
            <div id={"unloaded-weight-container"} style={{gridRow: 1, gridColumn: 1}}>
               <h3>Unloaded Weight (lbs)</h3>
               (section under development)
               <hr/>
               <button hidden onClick={() => {
                  setUnloaded(defaultUnloadedWeights)
               }}>reset</button>
               <div>Real World Examples:</div>
               <ul>
                  <li><a href={"https://www.thetruckersreport.com/truckingindustryforum/attachments/b9a6ca71-b803-4b06-8dd5-b43491aeb7ee-jpeg.389972/"} target={"_blank"}>unloaded weigh ticket</a></li>
                  <li><a href={"https://www.reddit.com/r/Truckers/comments/oipyl5/what_are_the_average_axle_weights_of_an_empty/"} target={"_blank"}>discussion forum</a></li>
               </ul>
            </div>
            <div id={"loaded-weight-container"} style={{gridRow: 2, gridColumn: 1}}>
               <h3>Loaded Weight (lbs)</h3>
               <div id={"drive-weight"} style={{top: zoom*sampleTrailer.kingpinDistanceFromNose + 15}}>Drive axles:<br/>
                  {Math.ceil(loaded ? loaded.drives : unloaded.drives).toLocaleString()} / {Number(34000).toLocaleString()}</div>
               <div id={"front-tandem-weight"} style={{top: frontTandAxleRenderPos + 8 - (6/zoom)}}>Trailer axle:<br/>
                  {Math.ceil(loaded ? loaded.fTandem : unloaded.fTandem).toLocaleString()} / {rearAxleTypeCapacity.toLocaleString()}</div>
               <div id={"rear-tandem-weight"} style={{top: rearTandAxleRenderPos + 8 + (6/zoom)}}>Trailer axle:<br/>
                  {Math.ceil(loaded ? loaded.rTandem : unloaded.rTandem).toLocaleString()} / {rearAxleTypeCapacity.toLocaleString()}</div>
               <div id={"combined-weight"} style={{top: zoom*sampleTrailer.interiorLength - 10}}>Combined:<br/>
                  {Math.ceil(loaded ? totalGrossWt(loaded) : totalGrossWt(unloaded)).toLocaleString()} / {Number(80000).toLocaleString()}</div>
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
            <canvas id={"load-diagram"} className={"no-border"} width={toInches(8)*zoom} height={sampleTrailer.interiorLength*zoom} style={{margin: "0 calc(50% - "+(toInches(4)*zoom)+"px)", gridRow: 2, gridColumn: 2}} onMouseUp={canvasClickListener}/>
            {/* ----------------------------------------------------------------- COLUMN 3 ----------------------------------------------------------------- */}
            <div id={"trailer-dimensions-container"} style={{gridRow: 1, gridColumn: 3}}>
               <h3 style={{gridColumn: "1/4"}}>Trailer Dimensions</h3>
               <button onClick={resetTrailerDimensionsListener}>reset</button>
               <div style={{gridColumn: 2}}>in</div>
               <div style={{gridColumn: 3}}>ft</div>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"interior-length-in"}>Interior Length</label>
               <input style={{gridColumn: 2}} type={"number"} id={"interior-length-in"} name={"interior-length-in"} disabled defaultValue={sampleTrailer.interiorLength}/>
               <input style={{gridColumn: 3}} type={"number"} id={"interior-length-ft"} name={"interior-length-ft"} step={0.5} min={48} max={53} defaultValue={toFeet(sampleTrailer.interiorLength)} onChange={interiorLengthListener}/>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"kingpin-distance-from-nose-in"}>Kingpin Distance From Nose</label>
               <input style={{gridColumn: 2}} type={"number"} id={"kingpin-distance-from-nose-in"} name={"kingpin-distance-from-nose-in"} disabled defaultValue={sampleTrailer.kingpinDistanceFromNose}/>
               <input style={{gridColumn: 3}} type={"number"} id={"kingpin-distance-from-nose-ft"} name={"kingpin-distance-from-nose-ft"} step={0.5} min={2} max={4} defaultValue={toFeet(sampleTrailer.kingpinDistanceFromNose)} onChange={kingpinPosListener}/>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"tandem-spread-width-in"}>Tandem Spread Width</label>
               <input style={{gridColumn: 2}} type={"number"} id={"tandem-spread-width-in"} name={"tandem-spread-width-in"} disabled defaultValue={sampleTrailer.tandemSpreadWidth}/>
               <input style={{gridColumn: 3}} type={"number"} id={"tandem-spread-width-ft"} name={"tandem-spread-width-ft"} step={0.5} min={3.5} max={12} defaultValue={toFeet(sampleTrailer.tandemSpreadWidth)} onChange={tandemSpreadWidthListener}/>
               <label style={{gridColumn: 1}} htmlFor={"tandem-center-distance-from-nose-in"}>{stateRestriction===null ? toTitleCase(unrestrictedReference.slice(2)) : toTitleCase(getStateTandemMeasurementReference(stateRestriction).slice(2))} Distance From Kingpin</label>
               <input style={{gridColumn: 2}} type={"number"} id={"tandem-center-distance-from-nose-in"} name={"tandem-center-distance-from-nose-in"} disabled defaultValue={tandemCenterDistanceFromNoseToStateRefDistance(sampleTrailer,stateRestriction)}/>
               <input style={{gridColumn: 3}} type={"number"} id={"tandem-center-distance-from-nose-ft"} name={"tandem-center-distance-from-nose-ft"} step={0.5} min={toFeet(tandemCenterDistanceFromNoseToStateRefDistance(minSlideTrailer,stateRestriction))} max={maxSlide} defaultValue={toFeet(tandemCenterDistanceFromNoseToStateRefDistance(sampleTrailer,stateRestriction))} onChange={tandemSliderListener}/>
               <div style={{gridColumn: "1/4"}} id={"tandem-slider-container"}><span>N</span><input type={"range"} id={"tandem-slider"} step={0.5} min={toFeet(tandemCenterDistanceFromNoseToStateRefDistance(minSlideTrailer,stateRestriction))} max={maxSlide} defaultValue={toFeet(tandemCenterDistanceFromNoseToStateRefDistance(sampleTrailer,stateRestriction))} onChange={tandemSliderListener}/><span>T</span></div>
               <select style={{gridColumn: "1/4"}} id={"destination-state"} onChange={destinationStateListener}>{
                  [<option>No restrictions</option>].concat(slideAxleRestrictedStates.map(e => e===SlideAxleRestrictionsDivider.str
                     ? <option disabled>{SlideAxleRestrictionsDivider.str}</option>
                     : <option selected={e.state===defaultState} id={"opt-"+e.state}>{(e.state+" ").padEnd(15,"-")+"> "+e.kingpinToTandemMaxLength+"' "+e.measurementReference}</option>
                  ))
               }</select>
               <a style={{gridColumn: "1/4"}} href={"https://www.bigtruckguide.com/kingpin-to-rear-axle/"} target={"_blank"}>slide axle restrictions source</a>
            </div>
            <div id={"editor-container"} style={{gridRow: 2, gridColumn: 3}}>
               <h3>Edit Pallet/Load</h3>
               (section under development)
               {loaded && <div>Order Weight: {Math.ceil(totalLoadWt(loaded,unloaded)).toLocaleString()}</div>}
               <div id={"selected-position-1"}>
                  {selectedPosition1 && <>
                     <h3>Selected Position 1</h3>
                     <div style={{whiteSpace: "pre", textAlign: "left", fontSize: "smaller"}}>{JSON.stringify(selectedPosition1,null,2)}</div>
                     <button onClick={() => {
                        setSampleTrailer(prev => rotatePosition(prev, selectedPosition1!.row, selectedPosition1!.side))
                        setSelectedPosition1(null)
                     }}>rotate</button>
                     <button onClick={() => {
                        setSelectedPosition1(null)
                     }}>deselect</button>
                     <button onClick={() => {
                        const i = selectedPosition1!.row - 1
                        const side = selectedPosition1!.side
                        switch (side) {
                           case Side.C: {
                              const deletedLength = (sampleTrailer.loadRows[i] as Single)._ctr_.orien.L
                              setSampleTrailer(prev => ({
                                 ...prev,
                                 loadRows: prev.loadRows
                                    .map((row,idx) => {
                                       if (idx <= i) return row
                                       else if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
                                          let movedRow = JSON.parse(JSON.stringify(row)) as Double
                                          if (movedRow.l___!==null) movedRow.l___.depth -= deletedLength
                                          if (movedRow.___r!==null) movedRow.___r.depth -= deletedLength
                                          return movedRow
                                       }
                                       else {
                                          let movedRow = JSON.parse(JSON.stringify(row)) as Single
                                          movedRow._ctr_.depth -= deletedLength
                                          return movedRow
                                       }
                                    })
                                    .filter((_,idx) => idx!==i)
                              }))
                              break;
                           }
                           case Side.L: {
                              (sampleTrailer.loadRows[i] as Double).l___ = null
                              setSampleTrailer(prev => {
                                 let after = JSON.parse(JSON.stringify(prev)) as Trailer&Load
                                 recalcDepths(after)
                                 return after
                              })
                              break;
                           }
                           case Side.R: {
                              (sampleTrailer.loadRows[i] as Double).___r = null
                              setSampleTrailer(prev => {
                                 let after = JSON.parse(JSON.stringify(prev)) as Trailer&Load
                                 recalcDepths(after)
                                 return after
                              })
                              break;
                           }
                        }
                        setSelectedPosition1(null)
                     }}>delete</button>
                  </>}
               </div>
               <div id={"selected-position-2"}>
                  {selectedPosition2 && <>
                     <hr/>
                     <h3>Selected Position 2</h3>
                     <div style={{whiteSpace: "pre", textAlign: "left", fontSize: "smaller"}}>{JSON.stringify(selectedPosition2,null,2)}</div>
                     <button onClick={() => {
                        setSampleTrailer(prev => rotatePosition(prev, selectedPosition2!.row, selectedPosition2!.side))
                        setSelectedPosition2(null)
                     }}>rotate</button>
                     <button onClick={() => {
                        setSelectedPosition2(null)
                     }}>deselect</button>
                  </>}
               </div>
            </div>
         </main>
      </>
   )
}

export default App
