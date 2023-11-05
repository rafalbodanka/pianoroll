export default function PlayerOptions({
    isPlaying, setIsPlaying, playTimestamp, setPlayTimestamp, start, end, x, setX, timestampX0, timestampX1 }:
    {
        isPlaying: boolean,
        setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
        playTimestamp: number,
        setPlayTimestamp: React.Dispatch<React.SetStateAction<number>>;
        start: number,
        end: number,
        x: number,
        setX: React.Dispatch<React.SetStateAction<number>>;
        timestampX0: number | null,
        timestampX1: number | null,
    }) {

        const switchPlay = () => {
        if (!timestampX0 && !isPlaying && x>=0.998) {
            setX(0)
        }
        if (timestampX1 && timestampX0 && x>timestampX1-0.002) {
            setX(timestampX0)
        }
        setIsPlaying(prev => !prev)
    }

    const stopAction = () => {
        setIsPlaying(false)
        setPlayTimestamp(start)
        timestampX1 && timestampX0 ? setX(timestampX0) : setX(0)
    }

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const milliseconds = Math.round((timeInSeconds - Math.floor(timeInSeconds)) * 1000)
            .toString()
            .padStart(3, '0');
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds}`;
    };

    return (
        <div className="mt-6">
            <p className="flex justify-center select-none">{formatTime(start + (end - start) * x)}</p>
            <div className="mt-2 flex justify-center gap-4">
                <div
                    onClick={switchPlay}
                    className="cursor-pointer bg-gray-300 hover:bg-gray-400 inline-flex items-center justify-center h-8 w-8" >
                    {isPlaying ?
                        <img className="h-4" src={'img/pause.svg'} alt='pause'/>
                        :
                        <img className="h-4" src={'img/play.svg'} alt="pause"/>
                    }
                </div>
                <div
                    onClick={stopAction}
                    className="cursor-pointer bg-gray-300 hover:bg-gray-400 inline-flex items-center justify-center h-8 w-8" >
                    <img className="h-4" src={'img/stop.svg'} alt='stop'/>
                </div>
            </div>
        </div>
    )
}