use std::{
    fmt,
    fs::File,
    io::{BufRead, BufReader},
};

pub fn load_data(word_size: u8) -> Vec<Word> {
    let file = File::open("words.txt").expect("File not found!");
    let reader = BufReader::new(file);

    // this vector will contain all the lines
    let mut words = vec![];

    for line in reader.lines().into_iter() {
        let word = line.unwrap();
        if word.len() == word_size as usize {
            words.push(Word::new(word));
        }
    }
    return words;
}

#[derive(Debug, Clone)]
pub struct Word {
    data: String,
}

impl Word {
    pub fn new(data: String) -> Self {
        Word { data }
    }
    pub fn length(&self) -> i32 {
        self.data.len() as i32
    }
    pub fn get_data(self) -> String {
        self.data
    }
}

impl fmt::Display for Word {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut spaces = String::new();
        for _ in 0..self.length() {
            spaces.push_str(" ")
        }
        write!(f, "{}", spaces)
    }
}

pub struct Guess {
    word: Word,
    spaces: Vec<String>,
}

impl Guess {
    pub fn new(word: Word) -> Self {
        let mut spaces: Vec<String> = vec![];
        for _ in 0..word.length() {
            spaces.push(String::from("_"))
        }
        Guess { word, spaces }
    }
    pub fn fill_guess(&mut self, letter: String) -> bool {
        let mut found = false;
        for (index, character) in self.word.data.chars().enumerate() {
            if letter == String::from(character) {
                found = true;
                self.spaces[index] = String::from(character);
            }
        }
        return found;
    }
    pub fn completed(&self) -> bool {
        !self.spaces.contains(&String::from("_"))
    }
}

impl fmt::Display for Guess {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let spaces = self.spaces.join(" ");
        write!(f, "{}", spaces)
    }
}
