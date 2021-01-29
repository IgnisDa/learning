use std::fs::File;
use std::io::prelude::Read;

pub fn run() {
    for _i in 1..3 {
        print!("{}", read_file_contents(" "));
    }
}
fn read_file_contents(filename: &str) -> String {
    let mut file = File::open(filename).expect("Haa that doesn't exist!");
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .expect("Can not read the file because I am a fucking idiot!");
    return contents;
}
