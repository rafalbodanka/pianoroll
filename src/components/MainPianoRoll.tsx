import { Note } from "../types/Note";
import { Color } from "../types/Color";
import { useEffect, useRef, useState } from "react";
import ToneRow from "./ToneRow";
import Tile from "./Tile";
import { time } from "console";

export function generateGradientTable(startColor: Color, endColor: Color, steps: number) {
  const gradientTable = [];
  for (let i = 0; i < steps; i++) {
    const r = startColor.r + ((endColor.r - startColor.r) * i) / (steps - 1);
    const g = startColor.g + ((endColor.g - startColor.g) * i) / (steps - 1);
    const b = startColor.b + ((endColor.b - startColor.b) * i) / (steps - 1);
    gradientTable.push(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
  }
  return gradientTable;
}

export default function MainPianoRoll({ it, sequence, isPlayed, isPlaying, currentTime }: { it: number; sequence: Note[]; isPlayed: boolean, isPlaying: boolean, currentTime: number }) {

    const svgRef = useRef<SVGSVGElement | null>(null);
    const [start, setStart] = useState<number>(0);
    const [end, setEnd] = useState<number>(0);
    const [noteHeight, setNoteHeight] = useState<number>(0);
	const [pitchMin, setPitchMin] = useState<number>(0)
	const [pitchMax, setPitchMax] = useState<number>(0)
	const [pitchSpan, setPitchSpan] = useState<number>(0);

    const [timestampX0, setTimestampX0] = useState<number | null>(null)
    const [timestampX1, setTimestampX1] = useState<number | null>(null)
    const [isDrawing, setIsDrawing] = useState<boolean>(false)

	useEffect(() => {
    if (!sequence || sequence.length === 0) return;

    // Extract data from sequence to calculate the piano roll
    const pitches = sequence.map(note => note.pitch);
    let pitchMin = Math.min(...pitches);
    let pitchMax = Math.max(...pitches);
    let pitchSpan = pitchMax - pitchMin;

    if (pitchSpan < 24) {
      const diff = 24 - pitchSpan;
      const low = Math.ceil(diff / 2);
      const high = Math.floor(diff / 2);
      pitchMin -= low;
      pitchMax += high;
      pitchSpan = pitchMax - pitchMin;
    }
    pitchMin -= 3;
    pitchMax += 3;
    pitchSpan = pitchMax - pitchMin;
    setStart(sequence[0].start);
    setEnd(sequence[sequence.length - 1].end - start);
    setNoteHeight(1 / pitchSpan);
		setPitchMax(pitchMax)
		setPitchMin(pitchMin)
		setPitchSpan(pitchSpan)
	}, [sequence]);

    const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (svgRef.current) {
            setIsDrawing(true)
            setTimestampX1(null)
            const svgBoundingBox = svgRef.current.getBoundingClientRect();
            const xCoordinate = (e.clientX - svgBoundingBox.left) / svgBoundingBox.width;
            setTimestampX0(xCoordinate)
        }
    }

    const handleSVGMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawing) return
        if (svgRef.current && timestampX0) {
            const svgBoundingBox = svgRef.current.getBoundingClientRect();
            const xCoordinate = (e.clientX - svgBoundingBox.left) / svgBoundingBox.width;
            setTimestampX1(xCoordinate)
        }
    }

    const handleSVGUp = (e: React.MouseEvent<SVGSVGElement>) => {
        if (svgRef.current && timestampX0) {
            setIsDrawing(false)
            const svgBoundingBox = svgRef.current.getBoundingClientRect();
            const xCoordinate = (e.clientX - svgBoundingBox.left) / svgBoundingBox.width;
            setTimestampX1(xCoordinate)
        }
    }

    
    useEffect(() => {
        // Attach a global mouseup event listener to handle mouseup outside the SVG element
        const handleGlobalMouseUp = () => {
            if (isDrawing) {
                setIsDrawing(false);
            }
        };

        window.addEventListener("mouseup", handleGlobalMouseUp);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isDrawing]);

    useEffect(() => {
        if (isDrawing || !timestampX0 || !timestampX1) return;
        let startTimeInSeconds = start + (end - start) * Math.min(timestampX0, timestampX1);
        let endTimeInSeconds = start + (end - start) * Math.max(timestampX0, timestampX1);
        
        if (startTimeInSeconds > endTimeInSeconds) {
          // Swap the values
          const temp = startTimeInSeconds;
          startTimeInSeconds = endTimeInSeconds;
          endTimeInSeconds = temp;
        }
        console.log(`Length: ${end}\nMark start: ${startTimeInSeconds}\nMark end: ${endTimeInSeconds}`);
        console.log(sequence[0].start)
        const markedNotes = sequence.filter(note => {
            console.log(note, startTimeInSeconds, endTimeInSeconds)
            return (note.start >= startTimeInSeconds && note.start <= endTimeInSeconds) || (note.end >= startTimeInSeconds && note.end <= endTimeInSeconds);
        })
        console.log('Marked notes: ')
        console.log(markedNotes)

    }, [isDrawing]);

  return (
		<div className={`w-[80%] h-1/2 shadow-lg border-[1.5px] border-[#2d2d2d] shadow-[rgb(24, 24, 24)] ${!isPlayed && 'cursor-pointer hover:scale-105 duration-300'}`}>
			<svg ref={svgRef} onMouseDown={handleSVGClick} onMouseMove={handleSVGMove} onMouseUp={handleSVGUp} width={'100%'} height={'100%'} viewBox="0 0 1 1" preserveAspectRatio="none">
    	{end && Array.from({ length: pitchSpan }, (_, index) => {
				return (
					<ToneRow key={index} pitchMax={pitchMax} pitchMin={pitchMin} index={index}/>
					);
				})}
			{end && Array.from({ length: sequence.length }, (_, index) => {
				return (
					<Tile
					key={index}
					index={index}
					start={start}
					sequence={sequence}
					pitchMin={pitchMin}
					pitchMax={pitchMax}
					pitchSpan={pitchSpan}
					/>
				)
			})}
            {timestampX0 && <rect width={0.002} height={1} x={timestampX0} y={0} fill="rgb(49, 27, 146)"/>}
            {timestampX0 && timestampX1 && <rect width={Math.abs(timestampX1 - timestampX0)} height={1} x={timestampX1 > timestampX0 ? timestampX0 : timestampX1} y={0} fill="rgb(49, 27, 146)" fillOpacity={'40%'}/>}
            {timestampX1 && <rect width={0.002} height={1} x={timestampX1} y={0} fill="rgb(49, 27, 146)"/>}
		</svg>
		<div className="select-none">piano roll number {it}</div>
    </div>
  );
}


