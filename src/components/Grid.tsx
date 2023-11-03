import React from "react";
import { Note } from "../types/Note";
import PianoRoll from "./PianoRoll";
import PianoRollSkeleton from "./PianoRollSkeleton";
import Player from "./Player";

export default function Grid({
    data,
    isLoading,
    playedRollIndex,
    setPlayedRollIndex,
}:
    {
        data: Note[],
        isLoading: boolean,
        playedRollIndex: number,
        setPlayedRollIndex: React.Dispatch<React.SetStateAction<number>>
    }) {

    const start = playedRollIndex * 60;
    const end = start + 60;
    const partData = data.slice(start, end)
    const openPlayer = (it: number) => {
        setPlayedRollIndex(it)
    }

    return (
        <div className={`${playedRollIndex !== -1 && 'grid grid-cols-5'} lg:mt-4 py-4 px-[3em]`}>
            <div className={`col-span-5 lg:col-span-4 ${playedRollIndex === -1 ? 'hidden' : ''}`}>
                <div
                className="cursor-pointer mb-8 inline-flex select-none bg-[#154151] tracking-wide text-[#F2F2F2] text-sm font-bold rounded-md py-1 px-2"
                onClick={() => { setPlayedRollIndex(-1) }}>
                    <div className="flex items-center gap-1">
                        <img className="h-4" src={'img/arrow-left.svg'} alt='arrow-left'/>
                        <span>back</span> 
                    </div>
                    </div>
                {playedRollIndex !== -1 && <Player playedRollIndex={playedRollIndex} partData={partData} />}
            </div>
            <div className={`${playedRollIndex === -1 ? 'main-grid' : 'mt-20 lg:mt-0 col-span-5 lg:col-span-1 flex flex-col gap-8 lg:overflow-y-scroll py-4 lg:h-[calc(100vh-28px-3em)]'}`}>
                {!isLoading ?
                    Array.from({ length: playedRollIndex === -1 ? 20 : 19 }, (_, it) => {
                        if (playedRollIndex === it) return
                        const start = it * 60;
                        const end = start + 60;
                        const partData = data.slice(start, end);
                        return (
                            <div className="flex justify-center" key={it} onClick={() => openPlayer(it)}>
                                <PianoRoll it={it} sequence={partData} />
                            </div>
                        );
                    })
                    :
                    // skeleton loading
                    Array.from({ length: 20 }, (_, it) => {
                        return (
                            <div className="flex justify-center" key={it}>
                                <PianoRollSkeleton />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}