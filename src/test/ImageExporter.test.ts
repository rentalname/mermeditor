import { describe, it, expect, beforeAll } from 'vitest';
import { ImageExporter } from './../ImageExporter.js';
import mermaid from 'mermaid';
import fs from 'fs/promises';
import path from 'path';

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
