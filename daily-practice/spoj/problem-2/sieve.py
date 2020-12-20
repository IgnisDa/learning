test_cases = int(input())

for _ in range(test_cases):
    # lower, upper = tuple(map(int, input().split()))
    # sieve = [True for _ in range(upper - lower)]
    upper = int(input())
    sieve = [True for _ in range(upper)]
    root_upper = int(upper ** 0.5)
    for index in range(upper):
        for factor in range(2, index):
            if index % factor == 0:
                sieve[index] = False
                break
    print(len(sieve))
    print(list(range(1, len(sieve) + 1)))
