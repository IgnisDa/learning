with open('data.in') as f:
    passwords = f.readlines()

count = 0
for password in passwords:
    num, letter, passwd = password.split()
    num = num.split('-')
    upper, lower = int(num[1]), int(num[0])
    occurrences = passwd.count(letter[:1])
    if lower <= occurrences <= upper:
        count += 1

print(count)

count = 0
for password in passwords:
    num, letter, passwd = password.split()
    num = num.split('-')
    upper, lower = int(num[1]), int(num[0])
    upper_satisfied = passwd[lower - 1] == letter[:1]
    lower_satisfied = passwd[upper - 1] == letter[:1]
    if upper_satisfied or lower_satisfied:
        count += 1
    if upper_satisfied == lower_satisfied and upper_satisfied:
        count -= 1

print(count)
