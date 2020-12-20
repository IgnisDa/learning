for _ in range(int(input())):
    num = int(input())
    fives = num // 5
    twos = num // 2
    a = str((5 ** fives) * (2 ** twos))
    print(len(a) - len(a.rstrip('0')))
