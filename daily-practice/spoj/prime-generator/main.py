def is_prime(N):
    return any(N % i == 0 for i in range(2, N))


for _ in range(int(input())):
    l, u = tuple(map(int, input().split()))
    for i in range(l, u + 1):
        if not is_prime(i):
            print(i)
