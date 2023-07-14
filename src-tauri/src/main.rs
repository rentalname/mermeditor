// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::Manager;

#[tauri::command]
fn greet(name: String, _app_handle: tauri::AppHandle) -> String {
    return format!("hello {}!", &name);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            if let Ok(_dev_tool) = env::var("DEV_TOOL") {
                #[cfg(debug_assertions)]
                app.get_window("main").unwrap().open_devtools();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
