# from pprint import pprint as print

# addend = []

# with open('data.in') as f:
#     data = f.readlines()
#     repeat = len(data)
#     data = list(map(list, data))
#     for d in data:
#         addend.append(3 * d[:-1])

# count = 0
# tree = '#'

# row, column = 0, 0

# while True:
#     if row == 0:
#         row += 1
#         column += 3
#         continue
#     try:
#         check = addend[row][column]
#         row += 1
#         column += 3
#         if check == tree:
#             count += 1
#     except IndexError:
#         break

# print(count)

with open('data.in') as f:
    biome = f.readlines()
    biome = list(map(lambda s: s[:-1], biome))

tree = '#'
count = 0
check = 0

for row in biome[1:]:
    if check >= 31:
        check -= 31
    if row[check] == tree:
        count += 1
    check += 3

print(count)
