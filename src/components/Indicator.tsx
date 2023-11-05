import { useEffect } from 'react';

export default function Indicator(
    { x, setX, start, end, isPlaying, setIsPlaying, playTimestamp, setPlayTimestamp, timestampX0, timestampX1 }
    :
    {
        x: number,
        setX: React.Dispatch<React.SetStateAction<number>>,
        start: number,
        end: number,
        isPlaying: boolean,
        setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
        playTimestamp: number,
        setPlayTimestamp: React.Dispatch<React.SetStateAction<number>>
        timestampX0: number | null,
        timestampX1: number | null,
    }
    ) {

    useEffect(() => {
        let animationFrameId: any;
        let previousTimestamp: any;

        const duration = end - start;
        const step = 1 / duration;

        const animate = (timestamp: any) => {
            if (!isPlaying || x >= 1 - 0.002) {
                setIsPlaying(false)
                return;
            }

            if (timestampX0 && timestampX1 !== null && x >= Math.max(timestampX0, timestampX1) - 0.002) {
                setIsPlaying(false)
                return
            }

            if (previousTimestamp === undefined) {
                previousTimestamp = timestamp;
            }

            setX((prevX) => {
                //60 hz
                const newX = prevX + step / 60;
                return newX >= 1 ? 1 : newX;
            });

            previousTimestamp = timestamp;
            animationFrameId = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [x, setX, start, end, isPlaying]);

    //Reset indicator on piano roll change
    useEffect(() => {
        setX(0)
        setIsPlaying(false)
    }, [end])

  return (
    <rect width={0.002} height={1} x={x} y={0} fill="rgb(28, 28, 28)" />
  );
}