// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs::{create_dir_all, File};
use std::io::Write;
use std::process::Command;

#[tauri::command]
fn export(code: String, app_handle: tauri::AppHandle) -> String {
    let cache_dir = app_handle.path_resolver().app_cache_dir().expect("msg");
    let filename = "a.mmd";
    let dir = env::temp_dir();
    let f_path = dir.as_path().join(filename);
    let mut file = File::create(f_path).expect("msg");
    writeln!(file, "{}", code).expect("msg");

    let binding = dir.as_path().join(filename);
    let input_file_path = binding.to_str().expect("msg");

    let out_dir = cache_dir.join("out/files");
    let binding = out_dir.join("a.png");
    let out_file_path = binding.to_str().expect("msg");

    if !out_dir.exists() {
        create_dir_all(out_dir).expect("msg");
    }

    let result = Command::new("yarn")
        .arg("mmdc")
        .args(["--input", input_file_path])
        .args(["-e", "png"])
        .args(["--output", out_file_path])
        .output()
        .expect("errrrrrooor");

    if result.status.success() {
        println!("stdout => {}", String::from_utf8(result.stdout).unwrap());
        return out_file_path.to_string();
    } else {
        println!("stderr => {}", String::from_utf8(result.stderr).unwrap());
        println!("{}", "FAIL");
        return "".to_string();
    }
}

struct AppPaths {
    input_file_path: String,
    output_file_path: String,
}

fn app_init(app_handle: tauri::AppHandle) -> AppPaths {
    let cache_dir = app_handle.path_resolver().app_cache_dir().expect("msg");

    let binding = env::temp_dir().join("a.mmd");
    let input_file_path = binding.to_str().expect("msg").to_string();

    let output_dir = cache_dir.join("out/files");
    let binding = output_dir.join("a.png");
    let output_file_path = binding.to_str().expect("msg").to_string();

    if !output_dir.exists() {
        create_dir_all(output_dir).expect("msg");
    }

    return AppPaths {
        input_file_path,
        output_file_path,
    };
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![export])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
