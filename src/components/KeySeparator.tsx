export default function KeySeparator({
    tone,
    y
}:
    {
        tone: number,
        y: number,
    }) {
    let lineWidth;
    // Every octave, line is bolder
    if (tone % 12 === 0) {
        lineWidth = 0.003;
    } else {
        lineWidth = 0.001;
    }

    return (
        <line x1={0} x2={1} y1={y} y2={y} strokeWidth={lineWidth} stroke="rgb(28, 28, 28)" />
    )
}