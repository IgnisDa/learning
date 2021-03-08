use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Welcome to the guessing game!");
    let secret_number = rand::thread_rng().gen_range(1, 101);

    loop {
        println!("Please input your guess: ");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read the input");

        print!("You guessed: {}", guess);

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Only numerical inputs allowed");
                continue;
            }
        };

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
