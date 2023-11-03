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
        <div className="lg:h-screen flex justify-center lg:justify-normal">
            <MainPianoRoll it={playedRollIndex} sequence={partData} isPlayed={true}/>
        </div>
    )
}