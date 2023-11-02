export default function ToneRow({ pitchMax, pitchMin, index }: { pitchMax: number, pitchMin: number, index: number }) {

    const tone = pitchMin + index
    const bgColor = [1, 3, 6, 8, 10].includes(tone % 12) ? 'rgb(93, 181, 213)' : 'rgb(242, 242, 242)'
    const pitchSpan = pitchMax - pitchMin
    const y = 1 - (tone - pitchMin) / pitchSpan;
    const x = 0;
    const h = 1 / pitchSpan;
    const w = 1;

    return (
        <>
        <rect
        x={x}
        y={y}
        fill={bgColor}
        width={w}
        height={h}/>
        </>
    )
}