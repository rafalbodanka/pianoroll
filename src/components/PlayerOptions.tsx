import { useState } from "react"

export default function PlayerOptions({isPlaying, setIsPlaying}: {isPlaying: boolean, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>}) {

    const switchPlay = () => {
        setIsPlaying(prev => !prev)
    }

    return (
        <div className="flex justify-center">
            <div
            onClick={switchPlay}
            className="mt-6 cursor-pointer bg-gray-300 inline-flex items-center justify-center h-8 w-8" >
                <div className="select-none" dangerouslySetInnerHTML={{ __html: isPlaying ? '&#8214;' : '&#10148;' }}></div>
            </div>
        </div>
    )
}