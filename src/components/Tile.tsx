import { useEffect, useState } from "react";
import { Note } from "../types/Note";


export default function Tile(
    { index, sequence, pitchMin, pitchMax, pitchSpan }:
    { index: number, sequence: Note[], start: number, pitchMin: number, pitchMax: number, pitchSpan: number }) {

    const note = sequence[index]
    const start = sequence[0].start
    const end = sequence[sequence.length - 1].end - start;

    const timeToX = (time: number) => {
        return time / end;
      }

    let y = 1 - (note.pitch - pitchMin) / pitchSpan
    let x = timeToX(note.start - start);
    let w = timeToX(note.end - note.start);
    const h = 1 / pitchSpan;

    if (y >= 0 && h > 0 && w > 0 && x >= 0) {
        return <rect width={w} height={h} x={x} y={y} />;
      } else {
        return null;
      }
}