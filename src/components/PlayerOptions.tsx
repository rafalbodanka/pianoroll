export default function PlayerOptions({
    isPlaying, setIsPlaying }:
    {
        isPlaying: boolean, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    }) {

    const switchPlay = () => {
        setIsPlaying(prev => !prev)
    }

    const stopAction = () => {
        setIsPlaying(false)
    }

    return (
        <div className="flex justify-center gap-4">
            <div
                onClick={switchPlay}
                className="mt-6 cursor-pointer bg-gray-300 hover:bg-gray-400 inline-flex items-center justify-center h-8 w-8" >
                {isPlaying ?
                    <img className="h-4" src={'img/pause.svg'} />
                    :
                    <img className="h-4" src={'img/play.svg'} />
                }
            </div>
            <div
                onClick={stopAction}
                className="mt-6 cursor-pointer bg-gray-300 hover:bg-gray-400 inline-flex items-center justify-center h-8 w-8" >
                <img className="h-4" src={'img/stop.svg'} />
            </div>
        </div>
    )
}