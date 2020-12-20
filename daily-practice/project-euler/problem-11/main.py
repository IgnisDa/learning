import math

with open('data.md') as f:
    numbers = f.readlines()

numbers = (num.replace('\n', '') for num in numbers)
numbers = (num.split() for num in numbers)

# This is the actual data in a list format
numbers = [[int(n) for n in num] for num in numbers]

new_numbers = numbers

# This is the transpose of the list
new_numbers = zip(*new_numbers)

maximum = 0
for num in numbers:
    product = math.prod(num)
    if product > maximum:
        maximum = product
for num in new_numbers:
    product = math.prod(num)
    if product > maximum:
        maximum = product

for num in numbers:
    print(num)


def get_diagonals(grid, bottom=True):
    dim = len(grid)
    assert dim == len(grid[0])
    return_grid = [[] for total in range(2 * len(grid) - 1)]
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            if bottom:
                return_grid[row + col].append(grid[col][row])
            else:
                return_grid[col - row + (dim - 1)].append(grid[row][col])
    return return_grid


for num in get_diagonals(numbers):
    product = math.prod(num)
    if product > maximum:
        maximum = product

# print(maximum)
