// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use resvg::{usvg::{Tree, Options, fontdb}, tiny_skia};
use image::ImageEncoder;
use image::codecs::png::PngEncoder;

#[tauri::command]
fn svg_to_png(svg: String) -> Result<Vec<u8>, String> {
    let opt = Options::default();
    let mut fontdb = fontdb::Database::new();
    fontdb.load_system_fonts();

    let rtree = Tree::from_data(svg.as_bytes(), &opt, &fontdb).map_err(|e| e.to_string())?;

    let pixmap_size = rtree.size().to_int_size();
    let mut pixmap = tiny_skia::Pixmap::new(pixmap_size.width(), pixmap_size.height())
        .ok_or("Failed to create pixmap")?;

    resvg::render(
        &rtree,
        tiny_skia::Transform::default(),
        &mut pixmap.as_mut(),
    );

    let mut buffer = Vec::new();
    let mut cursor = std::io::Cursor::new(&mut buffer);

    PngEncoder::new(&mut cursor).write_image(
        pixmap.data(),
        pixmap.width(),
        pixmap.height(),
        image::ColorType::Rgba8.into(),
    ).map_err(|e| e.to_string())?;

    Ok(buffer)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![svg_to_png])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
