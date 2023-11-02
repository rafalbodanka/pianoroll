import { useState } from "react";
import { Note } from "../types/Note";
import MainPianoRoll from "./MainPianoRoll";

export default function Player({
    playedRollIndex,
    partData
}:
    {
        playedRollIndex: number,
        partData: Note[]
    }) {

    return (
        <div className="h-screen">
            <MainPianoRoll it={playedRollIndex} sequence={partData} isPlayed={true}/>
        </div>
    )
}