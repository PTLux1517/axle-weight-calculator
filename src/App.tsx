import {ChangeEvent,MouseEvent,useEffect,useState} from 'react'
import './App.css'
import {
   AxleReferencePoint,
   AxleWeights,
   Double,
   fgPalletWeights,
   Load,
   O,
   P,Pallet,
   Position,
   PositionWithMeta,
   RearAxleTypeCapacity,
   Side,
   Single,StagedStackWithMeta,
   State,
   Trailer
} from './types.ts'
import {
   alertWithBlur,
   calcAxleWeights,
   deletePosition,
   getStateTandemMaxLength,
   getStateTandemMeasurementReference,loadStack,
   rotatePosition,sortStagedPalletsByStackWeight,
   stateRefDistanceToAxleDistanceFromNose,
   swapPositions,
   tandemCenterDistanceFromNoseToStateRefDistance,
   toFeet,
   toInches,
   totalGrossWt,
   totalLoadWt,totalStagedWt,
   toTitleCase
} from "./calculations.ts";
import {
   costco24ChunkTrailer,
   costcoAllShredTrailer,
   costcoMaxWeightTrailer,defaultTrailerDimensions,
   emptyTrailer,
   maxRowsAllStraightTrailer,
   minSlideTrailer,
   minTandCenterSlideLengthFromNose
} from "./sampleTrailers.ts";
import {slideAxleRestrictedStates,SlideAxleRestrictionsDivider,unrestrictedLength,unrestrictedReference} from "./slideAxleRestrictedStates.ts";


function App() {

   function setZoomSlider(newZoom:number) {
      (document.getElementById("zoom-slider") as HTMLInputElement).value = String(newZoom);
   }

   function resetUnloadedWeightsListener(e:MouseEvent) {
      (e.target as HTMLButtonElement).blur()
      setUnloaded(defaultUnloadedWeights);
      (document.getElementById("steers-wt-unloaded") as HTMLInputElement).value = String(defaultUnloadedWeights.steers);
      (document.getElementById("drives-wt-unloaded") as HTMLInputElement).value = String(defaultUnloadedWeights.drives);
      (document.getElementById("fTandem-wt-unloaded") as HTMLInputElement).value = String(defaultUnloadedWeights.fTandem);
      (document.getElementById("rTandem-wt-unloaded") as HTMLInputElement).value = String(defaultUnloadedWeights.rTandem);
   }

   function unloadedAxleWeightListener(e:ChangeEvent<HTMLInputElement>, axle:"steers"|"drives"|"front_tandem"|"rear_tandem") {
      const newAxleWt = Number(e.target?.value)
      setUnloaded((prev:AxleWeights) => (() => {switch (axle) {
         case "steers": return {...prev, steers: newAxleWt};
         case "drives": return {...prev, drives: newAxleWt};
         case "front_tandem": return {...prev, fTandem: newAxleWt};
         case "rear_tandem": return {...prev, rTandem: newAxleWt};
      }})())
   }

   function resetTrailerDimensionsListener(e:MouseEvent) {
      (e.target as HTMLButtonElement).blur()
      setSampleTrailer((prev:Trailer&Load) => ({
         ...prev,
         interiorLength: defaultTrailerDimensions.interiorLength,
         kingpinDistanceFromNose: defaultTrailerDimensions.kingpinDistanceFromNose,
         tandemSpreadWidth: defaultTrailerDimensions.tandemSpreadWidth,
         tandemCenterDistanceFromNose: defaultTrailerDimensions.tandemCenterDistanceFromNose,
      }));
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

   function addPalletToStagingListener(e:MouseEvent) {
      (e.target as HTMLButtonElement).blur()
      setStaged(prev => {
         let newStaged:Pallet[][] = [...prev]
         const stagingMultiplier = document.getElementById("staging-multiplier") as HTMLInputElement
         const stagingWeight = document.getElementById("staging-weight") as HTMLInputElement
         const stagingStack = document.getElementById("stage-stacked") as HTMLInputElement
         const stagingColorChep = document.getElementById("stage-chep") as HTMLInputElement
         const stagingColorWhite = document.getElementById("stage-white") as HTMLInputElement
         let multiplierSanitized = Math.min(100,Math.abs(Math.floor(Number(stagingMultiplier.value)))) ?? 0
         if (prev.length + multiplierSanitized > 100)
            multiplierSanitized = 100 - prev.length
         const weightSanitized = Math.min(5000,Math.abs(Math.floor(Number(stagingWeight.value)))) ?? 0
         const doubleStack = stagingStack.checked
         const color = stagingColorChep.checked ? P.Chep : P.White
         setTimeout(() => {
            stagingMultiplier.value = "1";
            stagingWeight.value = "";
            stagingStack.checked = false;
            stagingColorChep.checked = true;
            stagingColorWhite.checked = false;
         }, 100)
         if (isNaN(multiplierSanitized) || multiplierSanitized===0 || isNaN(weightSanitized) || weightSanitized===0) return prev
         while (multiplierSanitized>0) {
            if (doubleStack && multiplierSanitized>1) {
               newStaged.push([
                  {prdWt: weightSanitized,palWt: color},
                  {prdWt: weightSanitized,palWt: color}
               ])
               multiplierSanitized -= 2
            }
            else {
               newStaged.push([{prdWt: weightSanitized, palWt:color}])
               multiplierSanitized -= 1
            }
         }
         return sortStagedPalletsByStackWeight(newStaged)
      })
   }

   function unloadAllPalletsListener(e:MouseEvent) {
      (e.target as HTMLButtonElement).blur()
      setStaged(prev => {
         let unloaded:Pallet[][] = []
         sampleTrailer.loadRows.forEach(row => {
            if (row.hasOwnProperty(Side.C)) {
               row = row as Single
               unloaded.push(row._ctr_.stack)
            }
            else if (row.hasOwnProperty(Side.L) && row.hasOwnProperty(Side.R)) {
               row = row as Double
               if (row.l___!==null) unloaded.push(row.l___.stack)
               if (row.___r!==null) unloaded.push(row.___r.stack)
            }
         })
         return sortStagedPalletsByStackWeight([...prev].concat(unloaded))
      })
      setSelectedPosition1(null)
      setSelectedPosition2(null)
      setSampleTrailer(emptyTrailer)
   }

   function loadPalletListener(side:Side, orien:O) {
      if (selectedStaged.length!==1) {
         alertWithBlur("Only one pallet/stack can be loaded at a time. Please deselect all pallets, if necessary, and select only one pallet to load.")
         return
      }
      if (selectedStaged[0]!==undefined) {
         const selIdx = selectedStaged[0]
         const newTrailer = loadStack(sampleTrailer, staged[selIdx], side, orien)
         if (newTrailer!==sampleTrailer) {
            setSampleTrailer(newTrailer)
            setStaged(prev => prev.filter((_,idx) => idx!==selIdx))
            const div = document.getElementById("staged-stack-" + selIdx) as HTMLDivElement
            if (div && staged[selIdx][0]) div.style.background = staged[selIdx][0].palWt===P.Chep? "mediumblue" : "burlywood"
            setSelectedStaged(prev => prev.slice(1))
         }
      }
   }

   function deselectAllStagedListener(e:MouseEvent) {
      (e.target as HTMLButtonElement).blur();
      selectedStaged.forEach(stagedIdx =>
         (document.getElementById("staged-stack-"+stagedIdx) as HTMLDivElement).style.background = staged[stagedIdx][0].palWt===P.Chep ? "mediumblue" : "burlywood"
      )
      setSelectedStaged([]);
   }

   //const forceUpdate = useReducer(x => x+1, 0, () => 0)[1]
   const defaultZoom = 1.5
   const minZoom = 0.5
   const maxZoom = 6.5
   const zoomStep = 0.1
   const [zoom,setZoom] = useState(defaultZoom)
   const [selectedPosition1, setSelectedPosition1] = useState<PositionWithMeta|null>(null)
   const [selectedPosition2, setSelectedPosition2] = useState<PositionWithMeta|null>(null)
   const [selectedStaged, setSelectedStaged] = useState<number[]>([])
   const selectionColor1 = "darkgoldenrod"
   const selectionColor2 = "darkcyan"

   const defaultTrailer:Trailer&Load = emptyTrailer
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
   const [staged, setStaged] = useState<Pallet[][]>([])

   useEffect(() => {
      setLoaded(calcAxleWeights(sampleTrailer,unloaded,rearAxleTypeCapacity))
   },[sampleTrailer, unloaded]);

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
               if (i+1===selectedPosition1?.row && selectedPosition1.side===Side.L) ctx.fillStyle = selectionColor1
               if (i+1===selectedPosition2?.row && selectedPosition2.side===Side.L) ctx.fillStyle = selectionColor2
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
               if (i+1===selectedPosition1?.row && selectedPosition1.side===Side.R) ctx.fillStyle = selectionColor1
               if (i+1===selectedPosition2?.row && selectedPosition2.side===Side.R) ctx.fillStyle = selectionColor2
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
            ctx.fillStyle = c.stack[0] && c.stack[0].palWt === P.Chep ? "mediumblue" : "burlywood"
            if (i+1===selectedPosition1?.row && selectedPosition1.side===Side.C) ctx.fillStyle = selectionColor1
            if (i+1===selectedPosition2?.row && selectedPosition2.side===Side.C) ctx.fillStyle = selectionColor2
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

      /* draw 48 foot line */
      ctx.strokeStyle = "red"
      ctx.lineWidth = zoom
      ctx.strokeRect(zoom*39,zoom*toInches(48),axleWidth,zoom)
      ctx.fillStyle = "black"
      ctx.fillText("48ft",zoom*toInches(4),zoom*toInches(49))

   }, [zoom, sampleTrailer, selectedPosition1, selectedPosition2])

   return (
      <>
         <header><h1>Axle Weight Calculator</h1></header>
         <main>
            {/* ----------------------------------------------------------------- COLUMN 1 ----------------------------------------------------------------- */}
            <div id={"unloaded-weight-container"} style={{gridRow: 1, gridColumn: 1}}>
               <h3 style={{gridColumn: "1/3"}}>Unloaded Weight</h3>
               <div style={{gridColumn: "1/3"}} id={"unloaded-weight-subtext"}>(measured with tandems slid all the way back)</div>
               <button style={{gridColumn: 1}} onClick={resetUnloadedWeightsListener}>reset weights</button>
               <div style={{gridColumn: 2}}>lbs</div>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"steers-wt-unloaded"}>Steers</label>
               <input style={{gridColumn: 2}} type={"number"} id={"steers-wt-unloaded"} name={"steers-wt-unloaded"} min={100} max={12000} step={20} defaultValue={unloaded.steers} onChange={e => unloadedAxleWeightListener(e,"steers")}/>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"drives-wt-unloaded"}>Drives</label>
               <input style={{gridColumn: 2}} type={"number"} id={"drives-wt-unloaded"} name={"drives-wt-unloaded"} min={100} max={34000} step={20} defaultValue={unloaded.drives} onChange={e => unloadedAxleWeightListener(e,"drives")}/>
               <label style={{gridColumn: 1}} className={"divided"} htmlFor={"fTandem-wt-unloaded"}>Front Tandem</label>
               <input style={{gridColumn: 2}} type={"number"} id={"fTandem-wt-unloaded"} name={"fTandem-wt-unloaded"} min={100} max={rearAxleTypeCapacity} step={20} defaultValue={unloaded.fTandem} onChange={e => unloadedAxleWeightListener(e,"front_tandem")}/>
               <label style={{gridColumn: 1}} htmlFor={"rTandem-wt-unloaded"}>Rear Tandem</label>
               <input style={{gridColumn: 2}} type={"number"} id={"rTandem-wt-unloaded"} name={"rTandem-wt-unloaded"}  min={100} max={rearAxleTypeCapacity} step={20} defaultValue={unloaded.rTandem} onChange={e => unloadedAxleWeightListener(e,"rear_tandem")}/>
               <div style={{gridColumn: "1/3"}} id={"examples"}>
                  <div style={{gridColumn: "1/4"}}>Real World Examples:</div>
                  <div><a href={"https://www.thetruckersreport.com/truckingindustryforum/attachments/b9a6ca71-b803-4b06-8dd5-b43491aeb7ee-jpeg.389972/"} target={"_blank"}>unloaded weigh ticket</a></div> |
                  <div><a href={"https://www.reddit.com/r/Truckers/comments/oipyl5/what_are_the_average_axle_weights_of_an_empty/"} target={"_blank"}>discussion forum</a></div>
               </div>
            </div>
            <div id={"loaded-weight-container"} style={{gridRow: 2, gridColumn: 1}}>
               <h3>Loaded Weight (lbs)</h3>
               <div id={"drive-weight"} style={{top: zoom*sampleTrailer.kingpinDistanceFromNose + 15, color: (loaded && loaded.drives > 34000 ? "red" : "")}}>Drive Axles:<br/>
                  {Math.ceil(loaded ? loaded.drives : unloaded.drives).toLocaleString()} / {Number(34000).toLocaleString()}</div>
               {rearAxleTypeCapacity===RearAxleTypeCapacity.Tandem && <>
                  <div id={"tandem-weight"} style={{top: zoom * sampleTrailer.tandemCenterDistanceFromNose, color: (loaded && loaded.fTandem > rearAxleTypeCapacity ? "red": "")}}>Trailer Axles:<br/>
                     {Math.ceil(loaded ? loaded.fTandem+loaded.rTandem : unloaded.fTandem+unloaded.rTandem).toLocaleString()} / {(2*rearAxleTypeCapacity).toLocaleString()}</div>
               </>}
               {rearAxleTypeCapacity===RearAxleTypeCapacity.Spread && <>
               <div id={"front-tandem-weight"} style={{top: frontTandAxleRenderPos + 8 - (6/zoom), color: (loaded && loaded.fTandem > rearAxleTypeCapacity ? "red": "")}}>Trailer Axle:<br/>
                  {Math.ceil(loaded ? loaded.fTandem : unloaded.fTandem).toLocaleString()} / {rearAxleTypeCapacity.toLocaleString()}</div>
               <div id={"rear-tandem-weight"} style={{top: rearTandAxleRenderPos + 8 + (6/zoom), color: (loaded && loaded.rTandem > rearAxleTypeCapacity ? "red": "")}}>Trailer Axle:<br/>
                  {Math.ceil(loaded ? loaded.rTandem : unloaded.rTandem).toLocaleString()} / {rearAxleTypeCapacity.toLocaleString()}</div>
               </>}
               <div id={"combined-weight"} style={{top: zoom*sampleTrailer.interiorLength - 10, color: (totalGrossWt(loaded ?? unloaded) > 80000 ? "red" : "")}}>Combined:<br/>
                  {Math.ceil(loaded ? totalGrossWt(loaded) : totalGrossWt(unloaded)).toLocaleString()} / {Number(80000).toLocaleString()}</div>
            </div>
            <div style={{gridRow: 3, gridColumn: "1"}} id={"populate-staging-area-container"}>
               <h3>Populate Staging Area</h3>
               <div id={"staging-form-container"}>
                  <input type={"number"} id={"staging-multiplier"} min={1} max={100} step={1} defaultValue={1}/><span>x</span><input type={"text"} id={"staging-weight"} list={"finished-goods-pallet-weights"}/><datalist id={"finished-goods-pallet-weights"}>{fgPalletWeights.map(elem => <option>{elem}</option>)}</datalist>
                  <label htmlFor={"stage-stacked"}>double stack?</label><input type={"checkbox"} id={"stage-stacked"} name={"stage-stacked"} defaultChecked={false}/>
                  <span><div id={"staging-color"}>
                     <label htmlFor="stage-chep">C</label><input type={"radio"} id={"stage-chep"} name={"stage-color"} value={P.Chep} defaultChecked={true}/><br/>
                     <label htmlFor="stage-white">W</label><input type={"radio"} id={"stage-white"} name={"stage-color"} value={P.White}/>
                  </div></span>
                  <button id={"add-to-staging-button"} onClick={addPalletToStagingListener}>add</button>
               </div>
               <button id={"clear-staging-button"} onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); if (confirm("Clear all pallets from the staging area?")) {setSelectedStaged([]); setStaged([]);}}} disabled={staged.length===0}>clear staged</button>
            </div>
            <div style={{gridRow: 4, gridColumn: "1/4"}} id={"staged-pallets-container"}>
               <h3>Staged Pallets</h3>
               <div style={{color: "orange"}}>(section under development)<hr/></div>
               {staged.length === 0 && <div className={"hint"}>
                  <div>use the "Populate Staging Area" section to add pallets</div>
               </div>}
               {staged.length > 0 && <>
                  <div style={{position: "absolute", left: "10vw"}}>
                     <button disabled={selectedStaged.length===0} onClick={deselectAllStagedListener}>deselect all</button>&nbsp;
                     <button disabled={selectedStaged.length<2||6<selectedStaged.length}>stack together</button>
                  </div>
                  <div style={{position: "absolute", right: "10vw"}}>combine material to single: <br/>
                     <button disabled={selectedStaged.length<2}>chep</button>&nbsp;
                     <button disabled={selectedStaged.length<2}>white</button>
                  </div>
                  <div className={"hint"}>
                     <div>sorted by stack weight</div>
                     <div>click on a pallet to select</div>
                  </div>
               </>}
               <div id={"pallet-pool"}>{
                  staged.map((stack,idx) =>
                     <div id={"staged-stack-"+idx} style={{
                        width: zoom*O.Straight.W,
                        height: zoom*O.Straight.L,
                        background: (stack[0].palWt===P.Chep ? "mediumblue" : "burlywood"),
                        border: "4px solid black",
                        display: "flex",
                        flexDirection: "column-reverse",
                        fontFamily: "monospace",
                        fontSize: zoom*7.7,
                        fontWeight: "bold",
                        lineHeight: 1
                     }} onMouseUp={() => {if (!selectedStaged.includes(idx)) setSelectedStaged(prev => [...prev, idx]); const div = document.getElementById("staged-stack-"+idx) as HTMLDivElement; if (div) div.style.background = selectionColor1;}}>{
                        stack.map(pallet =>
                           <div>{
                              pallet.prdWt+""+(pallet.palWt===P.Chep ? "c" : "w")
                           }</div>
                        )
                     }</div>
                  )
               }</div>
            </div>
            {/* ----------------------------------------------------------------- COLUMN 2 ----------------------------------------------------------------- */}
            <div id={"zoom-container"} style={{gridRow: 1, gridColumn: 2}}>
               <div style={{color: "red"}}>(Todo: disclaimer/license)</div>
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
               <button onClick={(e:MouseEvent) => {
                  (e.target as HTMLButtonElement).blur();
                  setZoom(defaultZoom);
                  setZoomSlider(defaultZoom);
               }}>reset zoom</button>
            </div>
            <canvas id={"load-diagram"} className={"no-border"} width={toInches(8)*zoom} height={sampleTrailer.interiorLength*zoom} style={{margin: "0 calc(50% - "+(toInches(4)*zoom)+"px)", gridRow: 2, gridColumn: 2}} onMouseUp={canvasClickListener}/>
            <div style={{gridRow: 3, gridColumn: 2}} id={"add-pallet-buttons-container"}>
               <h3 style={{gridColumn: "1/4"}}>Load Selected Staged Pallet</h3>
               <div style={{color: "orange", fontWeight: "bold"}}>to left</div>
               <div style={{color: "orange", fontWeight: "bold"}}>in center</div>
               <div style={{color: "orange", fontWeight: "bold"}}>to right</div>
               <button onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); loadPalletListener(Side.L, O.Straight);}}>straight</button> <button onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); loadPalletListener(Side.C, O.Straight);}}>straight</button> <button onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); loadPalletListener(Side.R, O.Straight);}}>straight</button>
               <button onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); loadPalletListener(Side.L, O.Sideways);}}>sideways</button> <button onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); loadPalletListener(Side.C, O.Sideways);}}>sideways</button> <button onClick={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); loadPalletListener(Side.R, O.Sideways);}}>sideways</button>
            </div>
            {/* ----------------------------------------------------------------- COLUMN 3 ----------------------------------------------------------------- */}
            <div id={"trailer-dimensions-container"} style={{gridRow: 1, gridColumn: 3}}>
               <h3 style={{gridColumn: "1/4"}}>Trailer Dimensions</h3>
               <button onClick={resetTrailerDimensionsListener}>reset dimensions</button>
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
               <div style={{color: "orange"}}>(section under development)<hr/></div>
               {sampleTrailer.loadRows.length>0 && <>
                  <div style={{marginBottom: "20px"}}>Load lbs w/ Pallets: {loaded && Math.ceil(totalLoadWt(loaded,unloaded)).toLocaleString()}</div>
                  <div>
                     <button style={{display: "block", width: "100%", margin: "10px 0", background: "red"}} onMouseUp={(e:MouseEvent) => {(e.target as HTMLButtonElement).blur(); if (confirm("permanently delete all pallets from trailer?")) setSampleTrailer(emptyTrailer);}}>delete load</button>
                     <button style={{display: "block", width: "100%", margin: "10px 0"}} onMouseUp={unloadAllPalletsListener}>unload all</button>
                  </div>
               </>}
               {!selectedPosition1 && <div className={"hint"}>click on a pallet in the diagram to edit</div>}
               {selectedPosition1 && selectedPosition2 && <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px"}}>
                  <button style={{flex: 1}} onClick={() => {setSampleTrailer(prev => swapPositions(selectedPosition1!.row, selectedPosition1!.side, selectedPosition2!.row, selectedPosition2!.side, prev)); setSelectedPosition1(null); setSelectedPosition2(null);}}>swap selected</button>
                  <button style={{flex: 1}} onClick={() => {setSelectedPosition1(null); setSelectedPosition2(null);}}>deselect all</button>
               </div>}
               <div id={"selected-position-1"}>
                  {selectedPosition1 && <>
                     <h3>Selected Position 1</h3>
                     <div style={{whiteSpace: "pre", textAlign: "left", fontSize: "smaller", color: selectionColor1}}>{JSON.stringify(selectedPosition1,null,2)}</div>
                     <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px"}}>
                        <button style={{flex: 1}} onClick={() => {
                           setSampleTrailer(prev => rotatePosition(prev, selectedPosition1!.row, selectedPosition1!.side))
                           setSelectedPosition1(null)
                        }}>rotate</button>
                        <button style={{flex: 1}} onClick={() => {
                           setSelectedPosition1(null)
                        }}>deselect</button>
                        <button style={{flex: 1}} onClick={() => {

                           setSelectedPosition1(null)
                        }}>unload</button>
                        <button style={{flex: 1, backgroundColor: "red"}} onClick={() => {
                           if (confirm("delete selected position 1?")) {
                              setSampleTrailer(prev => deletePosition(selectedPosition1!.row,selectedPosition1!.side,prev))
                              setSelectedPosition1(null)
                           }
                        }}>delete</button>
                     </div>
                  </>}
               </div>
               <div id={"selected-position-2"}>
                  {selectedPosition2 && <>
                     <hr/>
                     <h3>Selected Position 2</h3>
                     <div style={{whiteSpace: "pre", textAlign: "left", fontSize: "smaller", color: selectionColor2}}>{JSON.stringify(selectedPosition2,null,2)}</div>
                     <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px"}}>
                        <button style={{flex: 1}} onClick={() => {
                           setSampleTrailer(prev => rotatePosition(prev, selectedPosition2!.row, selectedPosition2!.side))
                           setSelectedPosition2(null)
                        }}>rotate</button>
                        <button style={{flex: 1}} onClick={() => {
                           setSelectedPosition2(null)
                        }}>deselect</button>
                     </div>
                  </>}
               </div>
            </div>
            <div id={"staging-info-container"} style={{gridRow: 3, gridColumn: 3}}>
               <h3>Staging Info</h3>
               {staged.length > 0 && <div style={{display: "grid", gridTemplateColumns: "4fr 1fr", textAlign: "right"!}}>
                  <div style={{gridColumn:1}}>Staged Position Count: </div><div style={{gridColumn:2}}>{staged.length}</div>
                  <div style={{gridColumn:1}}>Staged lbs w/ Pallets: </div><div style={{gridColumn:2}}>{Math.ceil(totalStagedWt(staged)).toLocaleString()}</div><br/>
                  <div style={{gridColumn:1}}>Selected Position Count: </div><div style={{gridColumn:2}}>{selectedStaged.length}</div>
                  <div style={{gridColumn:1}}>Selected lbs w/ Pallets: </div><div style={{gridColumn:2}}>{Math.ceil(selectedStaged.map(idx => staged[idx]).reduce((selWtAcc,currSelStack) => selWtAcc+currSelStack.reduce((stackWtAcc,currPal) => stackWtAcc+currPal.prdWt+currPal.palWt,0),0)).toLocaleString()}</div>
               </div>}

            </div>
         </main>
         <footer>
            <div id="copyright-text">&copy; {new Date().getFullYear()} Cory Tomlinson. All rights reserved. [<a href={"https://ptlux1517.github.io"} target={"_blank"}>Portfolio</a> | <a href={"mailto:cory@ptlux1517.mozmail.com?subject=(Axle%20Weight%20Calculator%20Contact)%3A%20*your%20subject%20here*"} target={"_blank"}>Contact</a>]</div>
         </footer>
      </>
   )
}

export default App
