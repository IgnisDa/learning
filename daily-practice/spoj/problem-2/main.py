# Attempt 1
# Redacted due to time limit being exceeded
"""
import copy

test_cases = int(input())

for _ in range(test_cases):
    interval = list(map(int, input().split()))
    candidates = list(range(interval[0], interval[1]+1))
    prime_numbers = copy.deepcopy(candidates)
    for candidate in candidates:
        for number in range(2, candidate):
            if candidate % number == 0:
                try:
                    prime_numbers.remove(candidate)
                except ValueError:
                    pass
    for prime_number in prime_numbers:
        print(prime_number)
    print()
"""
###########################################

# Attempt 2
test_cases = int(input())

for _ in range(test_cases):
    interval = list(map(int, input().split()))
    candidates = list(range(interval[0], interval[1]+1))
