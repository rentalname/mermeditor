// Minimal ambient declarations for plugin packages (keep types happy)
declare module '@tauri-apps/plugin-dialog' {
  export function save(options?: any): Promise<string | null>;
  export function open(options?: any): Promise<string | null>;
  export function message(message: string, options?: any): Promise<void>;
  export function ask(message: string, options?: any): Promise<boolean>;
  export function confirm(message: string, options?: any): Promise<boolean>;
}

declare module '@tauri-apps/plugin-fs' {
  export function writeFile(options: { path: string; contents: Uint8Array | ArrayBuffer | string } | string, contents?: any): Promise<void>;
  export function readTextFile(path: string | { path: string }): Promise<string>;
  export function open(path: string, options?: any): Promise<any>;
  export function create(path: string, options?: any): Promise<any>;
}
