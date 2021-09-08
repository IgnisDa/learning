from collections import OrderedDict

sentence_length = int(input())
start = [input()]


def find_max_word(words_dict):
    s = list(words_dict.values())
    i = max(s)
    for word, occurrences in words_dict.items():
        if occurrences == i:
            return word


with open("./input.txt") as f:
    words = list(map(lambda s: s.strip("."), f.read().split()))

word_succeeding_counts = OrderedDict()
for index, word in enumerate(words):
    succeeding_word_count = OrderedDict()
    for i in range(index, len(words)):
        if word == words[i]:
            try:
                word_to_add = words[i + 1]
                succeeding_word_count[word_to_add] = (
                    succeeding_word_count.get(word_to_add, 0) + 1
                )
            except IndexError:
                pass
    if not word_succeeding_counts.get(word):
        word_succeeding_counts[word] = succeeding_word_count

word_to_add = start[0]
for i in range(sentence_length - 1):
    word_to_add = find_max_word(word_succeeding_counts[word_to_add])
    start.append(word_to_add)

print(" ".join(start))
