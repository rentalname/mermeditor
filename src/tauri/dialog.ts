// shim that exposes dialog functions via the plugin implementation
import { save as pluginSave, open as pluginOpen } from '@tauri-apps/plugin-dialog';

export async function save(options?: any): Promise<string | null> {
  return pluginSave(options as any);
}

export async function open(options?: any): Promise<string | null> {
  return pluginOpen(options as any);
}
