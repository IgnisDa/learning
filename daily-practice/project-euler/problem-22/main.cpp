#include <cstring>
#include <fstream>
#include <iostream>
#include <string>

using std::cin;
using std::cout;
using std::endl;
using std::ifstream;
using std::ofstream;
using std::string;
using std::strtok;

int main() {
    ifstream input("names.txt");
    char temp[100000];
    input >> temp;
    ofstream output("data.out");
    char* point;
    point = strtok(temp, ",");
    int count = 0;
    string list[10000];
    while (point != NULL) {
        list[count] = point;
        count++;
        point = strtok(NULL, ",");
    }
    for (string l : list) {
        cout << l << endl;
    }
    return 0;
}
