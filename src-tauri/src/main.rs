// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::process::Command;
use std::io::{Write};
use std::env;
#[tauri::command]
fn export(code: String) {
    let dir = env::temp_dir();
    let f_path = dir.as_path().join("a.md");
    let mut file = File::create(f_path).expect("msg");
    writeln!(file, "```mermaid\n{}\n```", code).expect("msg");

    let xx = dir.as_path().join("a.md");

    let result =
      Command::new("yarn")
        .arg("mmdc")
        .args(["--input", xx.to_str().expect("msg")])
        .output()
        .expect("errrrrrooor");
    let y = String::from_utf8(result.stdout).unwrap();
    println!("{}", "::TODO::");
    println!("{}", y);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![export])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}