import time

ITERATIONS = 255


def iterate_func(func, num):
    time_1 = time.time()
    for _ in range(1, num):
        func(num)
    return round((time.time() - time_1) * 1000000), func(num)


def fibonacci_memory(n):
    num_1 = 0
    num_2 = 1
    if n == 0:
        return 0
    elif n == 1:
        return num_2
    else:
        for _ in range(1, n):
            temp = num_1 + num_2
            num_1 = num_2
            num_2 = temp
        return num_2


def fibonacci_dynamic(n):
    array = [0, 1]
    if n <= 0:
        print("Incorrect input")
    elif n <= len(array):
        return array[n - 1]
    else:
        temp_array = fibonacci_dynamic(n - 1) + fibonacci_dynamic(n - 2)
        array.append(temp_array)
        return temp_array


def fibonacci_recursion(n):
    if n == 0:
        return 0
    elif n in [1, 2]:
        return 1
    return fibonacci_recursion(n - 1) + fibonacci_recursion(n - 2)


try:
    n = int(input("Input the value of `n`:\n"))
except ValueError:
    print("Please input a number")
    exit()

recursion = iterate_func(fibonacci_recursion, n - 1)
memory = iterate_func(fibonacci_memory, n - 1)
dynamic = iterate_func(fibonacci_dynamic, n)

assert memory[1] == dynamic[1] == recursion[1]

print(f"Recursion method took: '{recursion[0]}' micro seconds")
print(f"Dynamic method took: '{dynamic[0]}' micro seconds")
print(f"Memory optimized method took: '{memory[0]}' micro seconds")
