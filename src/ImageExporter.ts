import sharp from 'sharp';

type Option = {
  dpi?: number
  backgroundColor?: string
}

export class ImageExporter {
  public async svg2png(svg: string, { dpi = 300, backgroundColor = '#f6f6f6' }: Option = {}): Promise<Uint8Array | undefined> {
    try {
      const svgBuffer = Buffer.from(svg);

      const pngBuffer = await sharp(svgBuffer, { density: dpi })
        .flatten({ background: backgroundColor })
        .png()
        .toBuffer();

      return new Uint8Array(pngBuffer);
    } catch (error) {
      console.error('画像のエクスポート中にエラーが発生しました:', error);
      return undefined;
    }
  }
}
