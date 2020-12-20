#include <fstream>
#include <iostream>

using std::cin;
using std::cout;
using std::endl;
using std::ofstream;

int main() {
    ofstream output("data.out");
    int count = 0;
    for (int i = 2; count < 100; ++i) {
        bool flag = true;
        for (int j = 2; j < i; j++) {
            if (i % j == 0)
                flag = false;
        }
        if (flag) {
            output << i << ", ";
            count++;
        }
    }
    cout << "Process completed. Added " << count << " prime numbers";
    return 0;
}
