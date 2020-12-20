import random

from colorama import Fore, init

import utils

init(autoreset=True)

words = utils.data

to_guess = utils.Word(random.choice(words))

spaces = utils.Guess(to_guess)

number_of_guesses = 0
total_guesses = int(input('How many guesses would you like to make? '))
letters_guessed = set()

while True:
    print(f"\n{spaces}")
    if spaces.completed():
        print(
            f"{Fore.GREEN}Congratulations, you guessed the word correctly! "
            f"{Fore.GREEN}The word was {to_guess.data}."
        )
        break
    elif total_guesses == number_of_guesses:
        print(f"{Fore.RED}You can guess {total_guesses} times. Game Over!")
        break
    print(f"{Fore.BLUE}Enter your guess: ", end='')
    char = input().lower()
    if len(char) != 1:
        print(f"{Fore.RED}You can guess only one letter at a time!")
        continue
    elif char not in letters_guessed:
        letters_guessed.add(char)
    else:
        print(f"{Fore.RED}You have already tried this letter!")
        continue
    number_of_guesses += 1
    if not spaces.fill_guess(char):
        print(f"{Fore.RED}Your guess was incorrect!")
    print(f"{Fore.YELLOW}You have attempted {number_of_guesses} times")
