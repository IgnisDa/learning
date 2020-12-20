nums = eval(input())
target = eval(input())

for num in nums:
    try:
        addend = nums.index(target - num)
    except ValueError:
        pass

print(addend)
