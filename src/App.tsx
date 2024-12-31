import {useEffect, useState} from 'react'
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


   const [zoom,setZoom] = useState(1.0)



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
