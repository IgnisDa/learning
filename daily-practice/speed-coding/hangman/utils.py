class Word(str):

    def __init__(self, data):
        self.data = data

    def __str__(self):
        return f"{' '.join(list(self.data))}"


class Guess:

    def __init__(self, word):
        self.word = word
        self.spaces = list('_' * len(self.word))

    def __str__(self):
        return f"{' '.join(self.spaces)}"

    def fill_guess(self, letter):
        found = False
        for index, char in enumerate(self.word):
            if letter == char:
                found = True
                self.spaces[index] = char
        return found

    def completed(self):
        return '_' not in self.spaces


# Word list taken from https://github.com/dwyl/english-words and filtered
# according to needs
with open('words.txt') as f:
    data = f.readlines()
    data = list(map(lambda s: s.strip('\n'), data))
