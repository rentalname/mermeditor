import { initWasm, Resvg } from "@resvg/resvg-wasm";
import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";

(async () => {
  await initWasm(fetch(wasmUrl));
})()

export const svg2png = (svg: string): Uint8Array => {
  const resvg = new Resvg(svg)
  const image = resvg.render()
  const pngBuffer = image.asPng()
  return pngBuffer
}
