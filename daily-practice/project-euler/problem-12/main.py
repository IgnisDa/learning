counter = 0
total = 0

while True:
    counter += 1
    total += counter
    factors = 0
    for x in range(1, counter + 1):
        if counter % x == 0:
            factors += 1
            # print('Counter: ', counter, ' By: ', x, 'No. Factors: ', factors)
    print('Factors: ', factors)
    if factors == 500:
        print(counter)
        exit(0)
