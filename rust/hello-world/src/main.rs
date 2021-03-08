use std::fs;
use std::path::Path;

fn main() {
    create_directory("personal/dsfasdfadsfdssdFaSD/sfsefasdgaerg")
}

fn create_directory(name: &str) {
    if !Path::new(name).exists() {
        fs::create_dir(name).ok();
    }
}
