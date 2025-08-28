import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ImageExporter } from './../ImageExporter.js';
import mermaid from 'mermaid';
import fs from 'fs/promises';
import path from 'path';

// Mocking browser APIs
// @ts-ignore
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  scale: vi.fn(),
  imageSmoothingQuality: '',
  fillStyle: '',
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  toDataURL: vi.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
}));

// @ts-ignore
global.Image = class {
  onload: () => void = () => { };
  onerror: (err: Error) => void = () => { };
  src: string = '';
  width: number = 100;
  height: number = 100;

  constructor() {
    setTimeout(() => {
      if (this.src) {
        this.onload();
      } else {
        this.onerror(new Error('Image src is not set'));
      }
    }, 100);
  }
};

global.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
global.TextEncoder = require('util').TextEncoder;

const examplesDir = path.join(__dirname, './examples');

describe('ImageExporter', () => {
  beforeAll(() => {
    mermaid.initialize({ startOnLoad: false });
  });

  const runTest = async (fileName: string) => {
    const filePath = path.join(examplesDir, fileName);
    let code = await fs.readFile(filePath, 'utf-8');

    const { svg } = await mermaid.render('theGraph', code);

    const exporter = new ImageExporter();
    const png = await exporter.svg2png(svg);

    expect(png).toBeInstanceOf(Uint8Array);
    expect(png?.length).toBeGreaterThan(0);
  };

  it('should convert class diagram to png', async () => {
    await runTest('class_diagram.mmd');
  });

  it('should convert flowchart to png', async () => {
    await runTest('flowchart.mmd');
  });

  it('should convert sequence diagram from md to png', async () => {
    await runTest('sequence_diagram.mmd');
  });

  it('should convert sequence diagram to png', async () => {
    await runTest('sequence_diagram2.mmd');
  });
});
