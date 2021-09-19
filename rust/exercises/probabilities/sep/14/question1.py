y = input()
x = int(y[-1])
ss = [0, 1, 1, 1, 2, 2, 2, 3]
count = 0
for i in ss:
    if i == x:
        count += 1
print("PMF=" + str(count / len(ss)))
