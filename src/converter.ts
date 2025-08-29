import { invoke } from '@tauri-apps/api/tauri';

export const svg2png = async (svg: string) => {
  try {
    const result = await invoke<number[]>('svg_to_png', { svg });
    return new Uint8Array(result);
  } catch (error) {
    console.error('Error during SVG to PNG conversion:', error);
    return undefined;
  }
}
