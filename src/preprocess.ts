export const preprocessMermaidCode = (code: string): string => {
  return code.replace(/\\n/g, '<br/>');
};
