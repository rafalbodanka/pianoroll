import React from "react";
import { Note } from "../types/Note";
import PianoRoll from "./PianoRoll";
import PianoRollSkeleton from "./PianoRollSkeleton";
import PlayerOptions from "./PlayerOptions";
import Player from "./Player";

export default function Grid({
    data,
    isLoading,
    playedRollIndex,
    setPlayedRollIndex,
    setView
    }:
    {
        data: Note[],
        isLoading: boolean,
        playedRollIndex: number,
        setPlayedRollIndex: React.Dispatch<React.SetStateAction<number>>
        setView: React.Dispatch<React.SetStateAction<('grid' | 'play')>>
    }) {

        const start = playedRollIndex * 60;
        const end = start + 60;
        const partData = data.slice(start, end)
        const openPlayer = (it: number) => {
            setPlayedRollIndex(it)
            setView('play')
        }

    return (
        <div className={`${playedRollIndex !== -1 && 'grid grid-cols-5'} p-[3em]`}>
            <div className={`col-span-4 ${playedRollIndex === -1 ? 'hidden' : ''}`}>
                <div className="cursor-pointer mb-8 inline-flex select-none" onClick={() => {setPlayedRollIndex(-1); setView('grid')}}>&larr; return to grid view </div>
                {playedRollIndex !== -1 && <Player playedRollIndex={playedRollIndex} partData={partData} />}
            </div>
            <div className={`${playedRollIndex === -1 ? 'main-grid' : 'col-span-1 flex flex-col gap-8'}`}>
                {!isLoading ?
                    Array.from({ length: 20 }, (_, it) => {
                        const start = it * 60;
                        const end = start + 60;
                        const partData = data.slice(start, end);

                        return (
                            <div key={it} onClick={() => openPlayer(it)}>
                                <PianoRoll it={it} sequence={partData}/>
                            </div>
                        );
                    })
                    :
                    Array.from({ length: 20 }, (_, it) => {
                        return (
                            <div key={it}>
                                <PianoRollSkeleton />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}