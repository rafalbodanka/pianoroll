import { useEffect, useRef, useState } from "react";
import { Note } from "../types/Note";
import { Color } from "../types/Color";
import ToneRow from "./ToneRow";
import Tile from "./Tile";
import PlayerOptions from "./PlayerOptions";
import { time } from "console";
import Indicator from "./Indicator";

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

export default function MainPianoRoll({ it, sequence, isPlayed }: { it: number; sequence: Note[], isPlayed: boolean }) {

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
    const [selectedNotesNum, setSelectedNotesNum] = useState<number>(0)

    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [playTimestamp, setPlayTimestamp] = useState<number>(0)
    const [indicatorX, setIndicatorX] = useState(0)

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
        setEnd(sequence[sequence.length - 1].end);
        setPlayTimestamp(sequence[0].start)
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
            setIsPlaying(false)
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
            if (xCoordinate === timestampX0) {
                clearTimestamps()
                return
            }
            setTimestampX1(xCoordinate)
            setIndicatorX(Math.min(timestampX0, xCoordinate))
        }
    }

    //mobile actions
    const handleSVGTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
        if (svgRef.current) {
            setIsDrawing(true);
            setTimestampX1(null);
            const touch = e.touches[0]; // Get the first touch point
            const svgBoundingBox = svgRef.current.getBoundingClientRect();
            const xCoordinate = (touch.clientX - svgBoundingBox.left) / svgBoundingBox.width;
            setTimestampX0(xCoordinate);
        }
    };

    const handleSVGTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
        if (!isDrawing) return;
        if (svgRef.current && timestampX0) {
            const touch = e.touches[0]; // Get the first touch point
            const svgBoundingBox = svgRef.current.getBoundingClientRect();
            const xCoordinate = (touch.clientX - svgBoundingBox.left) / svgBoundingBox.width;
            setTimestampX1(xCoordinate);
        }
    };

    const handleSVGTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
        if (svgRef.current && timestampX0) {
            setIsDrawing(false);
            const touches = e.changedTouches;
            if (touches.length > 0) {
                const touch = touches[0]; // Get the first changed touch
                const svgBoundingBox = svgRef.current.getBoundingClientRect();
                const xCoordinate = (touch.clientX - svgBoundingBox.left) / svgBoundingBox.width;
                if (xCoordinate === timestampX0) {
                    clearTimestamps()
                    return;
                }
                setTimestampX1(xCoordinate);
                setIndicatorX(Math.min(timestampX0, xCoordinate))
            }
        }
    };

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

    const clearTimestamps = () => {
        timestampX0 && setIndicatorX(timestampX0)
        setTimestampX0(null)
        setTimestampX1(null)
        setSelectedNotesNum(0)
    }

    useEffect(() => {
        clearTimestamps()
    }, [sequence])

    useEffect(() => {
        if (!timestampX0 || !timestampX1) return;

        const startTimeInSeconds = start + (end - start) * Math.min(timestampX0, timestampX1);
        const endTimeInSeconds = start + (end - start) * Math.max(timestampX0, timestampX1);

        //Solution: mark info
        const markedNotes = sequence.filter(note => {
            return (
                (note.start <= endTimeInSeconds && note.end >= startTimeInSeconds) ||
                (note.start >= startTimeInSeconds && note.end <= endTimeInSeconds) ||
                (note.start <= startTimeInSeconds && note.end >= endTimeInSeconds)
            );
        })
        setSelectedNotesNum(markedNotes.length)

        if (isDrawing) return
        // Solution: show marked notes
        console.log('Marked notes: ')
        console.log(markedNotes)
    }, [isDrawing, timestampX1]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const milliseconds = Math.round((timeInSeconds - Math.floor(timeInSeconds)) * 1000)
            .toString()
            .padStart(3, '0');
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds}`;
    };

    return (
        <div className={`w-[100%] md:w-[90%] h-1/2 ${!isPlayed && 'cursor-pointer hover:scale-105 duration-300'}`}>
            <div className="select-none">piano roll number {it}</div>
            <svg className="border-[1.5px] border-[#2d2d2d]"
                ref={svgRef}
                onMouseDown={handleSVGClick}
                onMouseMove={handleSVGMove}
                onMouseUp={handleSVGUp}
                onTouchStart={handleSVGTouchStart}
                onTouchMove={handleSVGTouchMove}
                onTouchEnd={handleSVGTouchEnd}
                width={'100%'}
                height={'100%'}
                viewBox="0 0 1 1"
                preserveAspectRatio="none">
                {end && Array.from({ length: pitchSpan }, (_, index) => {
                    return (
                        <ToneRow key={index} pitchMax={pitchMax} pitchMin={pitchMin} index={index} />
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
                {timestampX0 && <rect width={0.002} height={1} x={timestampX0} y={0} fill="rgb(49, 27, 146)" />}
                {timestampX0 && timestampX1 && <rect width={Math.abs(timestampX1 - timestampX0)} height={1} x={timestampX1 > timestampX0 ? timestampX0 : timestampX1} y={0} fill="rgb(49, 27, 146)" fillOpacity={'40%'} />}
                {timestampX1 && <rect width={0.002} height={1} x={timestampX1} y={0} fill="rgb(49, 27, 146)" />}
                <Indicator
                    x={indicatorX}
                    setX={setIndicatorX}
                    start={start} end={end}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    playTimestamp={playTimestamp}
                    setPlayTimestamp={setPlayTimestamp}
                    timestampX0={timestampX0}
                    timestampX1={timestampX1}
                />
            </svg>
            <div className="flex justify-between">
                <div className="select-none">{formatTime(start)}</div>
                <div className="select-none">{formatTime(end)}</div>
            </div>
            {timestampX0 && timestampX1 &&
                <div className="select-none">
                    <div className="flex gap-2 items-center">
                        <p>
                            Selected range:&nbsp;
                            <span className="font-bold">
                                {formatTime(start + (end - start) * Math.min(timestampX0, timestampX1))}
                                &nbsp;:&nbsp;
                                {formatTime(start + (end - start) * Math.max(timestampX0, timestampX1))}
                            </span>
                        </p>
                        <div>
                            <img className="h-6 cursor-pointer" onClick={() => { setTimestampX0(null); setTimestampX1(null) }} src="img/delete.svg" alt='delete' />
                        </div>
                    </div>
                    <p>
                        Number of selected notes: <span className="font-bold">{selectedNotesNum}</span>
                    </p>
                </div>
            }
            {end &&
                <PlayerOptions
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    playTimestamp={playTimestamp}
                    setPlayTimestamp={setPlayTimestamp}
                    x={indicatorX}
                    setX={setIndicatorX}
                    start={start}
                    end={end}
                    timestampX0={timestampX0}
                    timestampX1={timestampX1}
                />}
        </div>
    );
}


