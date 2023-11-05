import { Color } from "../types/Color";

export default function useGenerateGradientTable(startColor: Color, endColor: Color, steps: number) {
    const gradientTable = [];
    for (let i = 0; i < steps; i++) {
      const r = startColor.r + ((endColor.r - startColor.r) * i) / (steps - 1);
      const g = startColor.g + ((endColor.g - startColor.g) * i) / (steps - 1);
      const b = startColor.b + ((endColor.b - startColor.b) * i) / (steps - 1);
      gradientTable.push(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
    }
    return gradientTable;
  }