import { Note } from "../types/Note";
import { useEffect, useState } from "react";
import ToneRow from "./ToneRow";
import Tile from "./Tile";

export default function PianoRoll({ it, sequence }: { it: number; sequence: Note[] }) {

  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [pitchMin, setPitchMin] = useState<number>(0)
  const [pitchMax, setPitchMax] = useState<number>(0)
  const [pitchSpan, setPitchSpan] = useState<number>(0);

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
    setPitchMax(pitchMax)
    setPitchMin(pitchMin)
    setPitchSpan(pitchSpan)
  }, [sequence]);

  return (
    <div className='w-[80%] h-[150px] shadow-lg border-[1.5px] border-[#2d2d2d] shadow-[rgb(24, 24, 24)] cursor-pointer hover:scale-105 duration-300'>
      <svg width={'100%'} height={'100%'} viewBox="0 0 1 1" preserveAspectRatio="none">
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
      </svg>
      <div className="select-none">piano roll number {it}</div>
    </div>
  );
}


