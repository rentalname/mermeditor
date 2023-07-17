import { nanoid } from 'nanoid';

export interface MermaidFile {
  id: string;
  name?: string;
  content: string;
  edited?: boolean;
  origin?: MermaidFile;

  contentType(): string;
}

export const newMermeidFile = () => {
  return new MermaidFileClass({
    name: '(new file)',
  });
};

const diagrams = [
  { regex: /classDiagram/, type: 'CD' },
  { regex: /erDiagram/, type: 'ER' },
  { regex: /flowchart/, type: 'FC' },
  { regex: /sequenceDiagram/, type: 'SQ' },
  { regex: /timeline/, type: 'TL' }
];

export class MermaidFileClass implements MermaidFile {
  id: string;
  name?: string;
  content: string;
  edited?: boolean;
  origin?: MermaidFile;

  constructor({ id, name, content }: { id?: string; name?: string; content?: string; }) {
    this.id = id || nanoid();
    this.name = name;
    this.content = content || '';
  }

  contentType(): string {
    if (!this.content) return '*';

    for (const diagram of diagrams) {
      if (diagram.regex.test(this.content)) {
        return diagram.type;
      }
    }
    return '*';
  };
};
