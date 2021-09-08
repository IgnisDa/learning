import random

N = int(input())
mol = ["My", "First", "Probability", "Program"]
itemall = []
source1 = []
source2 = []
source3 = []
source4 = []


random.seed(N)

for j in range(1, 1000):
    itemall.append(random.choice(mol))

for i in range(1, 998):
    if itemall[i] == "My":
        source1.append(itemall[i + 1])
    elif itemall[i] == "First":
        source2.append(itemall[i + 1])
    elif itemall[i] == "Probability":
        source3.append(itemall[i + 1])
    elif itemall[i] == "Program":
        source4.append(itemall[i + 1])


frequency1 = {}
for item in source1:
    frequency1[item] = frequency1.get(item, 0) + 1

frequency2 = {}
for item in source2:
    frequency2[item] = frequency2.get(item, 0) + 1


frequency3 = {}
for item in source3:
    frequency3[item] = frequency3.get(item, 0) + 1

frequency4 = {}
for item in source4:
    frequency4[item] = frequency4.get(item, 0) + 1


print(
    frequency1["My"] / len(source1),
    frequency1["First"] / len(source1),
    frequency1["Probability"] / len(source1),
    frequency1["Program"] / len(source1),
)
print(
    frequency2["My"] / len(source2),
    frequency2["First"] / len(source2),
    frequency2["Probability"] / len(source2),
    frequency2["Program"] / len(source2),
)
print(
    frequency3["My"] / len(source3),
    frequency3["First"] / len(source3),
    frequency3["Probability"] / len(source3),
    frequency3["Program"] / len(source3),
)
print(
    frequency4["My"] / len(source4),
    frequency4["First"] / len(source4),
    frequency4["Probability"] / len(source4),
    frequency4["Program"] / len(source4),
)
