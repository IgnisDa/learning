use std::{convert::TryInto, io::stdin, time::Instant};

const ITERATIONS: u8 = 255;

fn main() {
    let mut input = String::new();
    println!("Input the value of `n`:");
    stdin()
        .read_line(&mut input)
        .expect("Error reading input...");
    let n: u64 = input.trim().parse().expect("Please input a number");

    let recursion = iterate_func(fibonacci_recursion, n - 1);
    let dynamic = iterate_func(fibonacci_dynamic, n);
    let memory = iterate_func(fibonacci_memory, n - 1);

    assert_eq!(recursion.1, dynamic.1);
    assert_eq!(memory.1, dynamic.1);

    println!("Recursion method took: '{}' micro seconds", recursion.0);
    println!("Dynamic method took: '{}' micro seconds", dynamic.0);
    println!("Memory optimized method took: '{}' micro seconds", memory.0);
}

fn fibonacci_memory(n: u64) -> u64 {
    let mut num_1: u64 = 0;
    let mut num_2: u64 = 1;
    if n == 0 {
        return 0;
    } else if n == 1 {
        return num_2;
    } else {
        for _ in 1..n {
            let temp = num_1 + num_2;
            num_1 = num_2;
            num_2 = temp;
        }
        return num_2;
    }
}

fn fibonacci_dynamic(n: u64) -> u64 {
    let mut array = vec![0, 1];
    if n <= 0 {
        println!("Incorrect input");
        return n;
    } else if n <= array.len().try_into().unwrap() {
        return array[(n - 1) as usize];
    } else {
        let temp_array = fibonacci_dynamic(n - 1) + fibonacci_dynamic(n - 2);
        array.push(temp_array);
        return temp_array;
    }
}

fn fibonacci_recursion(n: u64) -> u64 {
    if n == 0 {
        return 0;
    } else if n == 1 || n == 2 {
        return 1;
    }
    return fibonacci_recursion(n - 1) + fibonacci_recursion(n - 2);
}

fn iterate_func(func: fn(u64) -> u64, num: u64) -> (u128, u64) {
    let now = Instant::now();
    for _ in 1..ITERATIONS {
        func(num);
    }
    return (now.elapsed().as_micros(), func(num));
}
