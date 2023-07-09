import { getTransformStyles } from "react-zoom-pan-pinch";

export const blurReductionTransformer = (x: number, y: number, s: number) => getTransformStyles(Math.ceil(x), Math.ceil(y), s)
