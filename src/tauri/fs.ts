// shim that uses plugin-fs implementation (resolves at build time)
import { writeFile as pluginWriteFile, readTextFile as pluginReadTextFile } from '@tauri-apps/plugin-fs';

export async function writeFile(pathOrOpts: any, contents?: any): Promise<void> {
  // plugin-fs expects (path, contents)
  if (typeof pathOrOpts === 'string') {
    return pluginWriteFile(pathOrOpts, contents as any);
  }
  // if given an object like { path, contents }
  return pluginWriteFile(pathOrOpts.path, pathOrOpts.contents as any);
}

export async function readTextFile(pathOrOpts: any): Promise<string> {
  if (typeof pathOrOpts === 'string') {
    return pluginReadTextFile(pathOrOpts as any);
  }
  return pluginReadTextFile(pathOrOpts.path as any);
}
