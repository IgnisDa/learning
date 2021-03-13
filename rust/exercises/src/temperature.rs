use core::f64;
use std::io;

fn main() {
    let mut num: i32;
    loop {
        let mut input = String::new();
        println!("1. Fahrenheit to Celsius\n2. Celsius to Fahrenheit\nPlease type your input: ");
        io::stdin()
            .read_line(&mut input)
            .expect("There was an error in reading input");
        num = input.trim().parse().expect("Error parsing number");
        if num != 1 && num != 2 {
            println!("Invalid input\n")
        } else {
            break;
        }
    }
    let symbol = if num == 1 { 'F' } else { 'C' };
    println!("\nPlease input the temperature in °{}:", symbol);
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("There was an error reading input");
    let quantity = input
        .trim()
        .parse::<f64>()
        .expect("Please input a valid number");
    let answer = if num == 1 {
        (quantity - 32.0) * (5.0 / 9.0)
    } else {
        (quantity * (9.0 / 5.0)) + 32.0
    };
    let symbol = if num == 2 { 'F' } else { 'C' };
    println!("The answer is {}°{}", answer, symbol)
}
