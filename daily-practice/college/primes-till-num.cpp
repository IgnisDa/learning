#include <fstream>
#include <iostream>

using std::cin;
using std::cout;
using std::endl;
using std::ifstream;
using std::ofstream;

int main() {
    ifstream input("primes-till-num.in");
    ofstream output("data.out");

    int upper;
    input >> upper;
    output << "Prime Numbers are: ";
    for (int i = 1; i <= upper; ++i) {
        bool flag = true;
        for (int j = 2; j < i; j++) {
            if (i % j == 0)
                flag = false;
        }
        if (flag)
            output << i << ", ";
    }
    return 0;
}
