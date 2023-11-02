import { useEffect, useState } from "react";
import { Note } from "../types/Note";
import PianoRoll from "./PianoRoll";
import PlayerOptions from "./PlayerOptions";
import MainPianoRoll from "./MainPianoRoll";

export default function Player({
    playedRollIndex,
    partData
}:
{
    playedRollIndex: number,
    partData: Note[]
}) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState(0);

    return (
        <div className="h-screen">
            <MainPianoRoll it={playedRollIndex} sequence={partData} isPlayed={true} isPlaying={isPlaying} currentTime={currentTime}/>
            <PlayerOptions isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
        </div>
    )
}