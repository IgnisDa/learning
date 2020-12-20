import string

lower_case = string.ascii_letters
with open('names.txt') as f:
    names = f.read().split(',')

for index, name in enumerate(names):
    names[index] = name.replace('"', '').lower()

names.sort()

total_score = 0
for index, name in enumerate(names, 1):
    worth = list(name)
    score = sum([lower_case.index(char) + 1 for char in worth])
    total_score += score * index

print(total_score)
