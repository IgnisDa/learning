class HashTable:

    def __init__(self, size=100):
        self.size = size
        self.array = [list() for _ in range(self.size)]

    def get_hash_code(self, key):
        return sum(ord(letter) for letter in str(key))

    def __setitem__(self, key, value):
        index = self.get_hash_code(key)
        found = False
        for i, k, v in enumerate(self.array[index]):
            if k == key:
                self.array[index][i] = (key, value)
                found = True
        if not found:
            self.array[index].append((key, value))
        print()

    def __getitem__(self, key):
        pass

    def __delitem__(self, key):
        pass


h = HashTable(500)
h['h'] = 'shit'
