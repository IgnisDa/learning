use colored::*;
use rand::Rng;
use std::collections::HashSet;
use std::io;
mod utils;
use std::io::Write; // <--- bring flush() into scope

fn main() {
    print!(
        "{}",
        "How long should the word you want to guess be? ".magenta()
    );
    io::stdout().flush().unwrap();
    let mut word_size = String::new();
    let mut temp_bool = true;
    while temp_bool {
        match io::stdin().read_line(&mut word_size) {
            Ok(_) => {
                let word_size: u8 = word_size
                    .trim()
                    .parse()
                    .expect("Please input only positive integers less than 255");
                if 5 <= word_size && word_size <= 10 {
                    temp_bool = false;
                }
                println!("{}", "Please input integers between 5 and 10".cyan());
            }
            Err(e) => {
                println!("There was an error reading input: {}", e);
            }
        };
    }
    let word_size: u8 = word_size
        .trim()
        .parse()
        .expect("Please input only positive integers less than 255");
    let mut words = utils::load_data(word_size);

    // we generate a random index which we will use to select a word from the `words`
    // vector
    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..words.len());

    // store the random word in a variable
    let to_guess = words.remove(random_index);

    // we take input from the user, asking them how many guesses they would like to make
    println!("\nHow many times would you like to guess? These are the number of times you can guess incorrectly.");
    let mut num_guesses_str = String::new();
    let mut temp_bool = true;
    while temp_bool {
        match io::stdin().read_line(&mut num_guesses_str) {
            Ok(_) => {
                let total_guesses: u8 = num_guesses_str
                    .trim()
                    .parse()
                    .expect("Please input only positive integers less than 255");
                if total_guesses >= 5 {
                    temp_bool = false;
                }
            }
            Err(e) => {
                println!("There was an error reading input: {}", e);
            }
        };
    }
    let mut number_of_guesses = 0;
    let total_guesses: u8 = num_guesses_str
        .trim()
        .parse()
        .expect("Please input only positive integers less than 255");

    // we will store the letters guessed by the user in a HashMap (or a set in python)
    let mut guessed_letters: HashSet<String> = HashSet::new();
    let to_guess_temp = to_guess.clone();
    let mut spaces = utils::Guess::new(to_guess);

    loop {
        println!("\n{}", spaces);
        if spaces.completed() {
            println!(
                "{}",
                format!(
                    "Congratulations, you guessed the word correctly! The word was {}.",
                    to_guess_temp.get_data()
                )
                .green(),
            );
            break;
        } else if total_guesses == number_of_guesses {
            println!(
                "{}",
                format!(
                    "You can guess only {} time(s). Game over! The word was: '{}'.",
                    total_guesses,
                    to_guess_temp.get_data()
                )
                .red()
            );
            break;
        }
        println!("{}", "Input your guess: ".blue());
        println!(
            "{}",
            format!(
                "You have made {} incorrect guesses, {} incorrect guesses left",
                number_of_guesses,
                total_guesses - number_of_guesses
            )
            .yellow()
        );
        let mut input = String::new();
        match io::stdin().read_line(&mut input) {
            Ok(size) => {
                if size != 2 {
                    println!("{}", "You can guess only one letter at a time!".red());
                    number_of_guesses += 1;
                    continue;
                }
            }
            Err(e) => {
                println!("There was an error reading input: {}", e);
            }
        };
        let input = String::from(input.trim());
        let temp = String::from(input.trim().clone());
        match guessed_letters.insert(input) {
            false => {
                println!("{}", "You have already tried this letter!".red());
                continue;
            }
            _ => {}
        }
        if !spaces.fill_guess(temp) {
            number_of_guesses += 1;
            println!("{}", "Your guess was incorrect!".yellow())
        }
    }
}
