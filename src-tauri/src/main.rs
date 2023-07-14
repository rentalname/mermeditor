// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs::{create_dir_all, File};
use std::io::Write;
use std::process::Command;

use tauri::Manager;

#[tauri::command]
fn export(code: String, app_handle: tauri::AppHandle) -> String {
    let app_paths = app_init(app_handle);

    let mut file = File::create(app_paths.input_file_path.clone()).expect(&line!().to_string());
    writeln!(file, "{}", code).expect(&line!().to_string());

    let result = Command::new("yarn")
        .arg("mmdc")
        .args(["--input", &app_paths.input_file_path])
        .args(["-e", "png"])
        .args(["--output", &app_paths.output_file_path])
        .arg("-q")
        .output()
        .expect(&line!().to_string());

    if result.status.success() {
        println!(
            "stdout => {}",
            String::from_utf8(result.stdout).expect(&line!().to_string())
        );
        return app_paths.output_file_path;
    } else {
        println!(
            "stderr => {}",
            String::from_utf8(result.stderr).expect(&line!().to_string())
        );
        println!("FAIL");
        return "".to_string();
    }
}

struct AppPaths {
    input_file_path: String,
    output_file_path: String,
}

fn app_init(app_handle: tauri::AppHandle) -> AppPaths {
    let cache_dir = app_handle
        .path_resolver()
        .app_cache_dir()
        .expect(&line!().to_string());

    let binding = env::temp_dir().join("a.mmd");
    let input_file_path = binding.to_str().expect(&line!().to_string()).to_string();

    let output_dir = cache_dir.join("out/files");
    let binding = output_dir.join("a.png");
    let output_file_path = binding.to_str().expect(&line!().to_string()).to_string();

    if !output_dir.exists() {
        create_dir_all(output_dir).expect(&line!().to_string());
    }

    return AppPaths {
        input_file_path,
        output_file_path,
    };
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![export])
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
