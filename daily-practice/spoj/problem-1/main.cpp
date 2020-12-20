#include <iostream>

using std::cin;
using std::cout;
using std::endl;

int main()
{
    int input;
    while (1)
    {
        cin >> input;
        if (input == 42)
            break;
        else
        {
            cout << input << endl;
        }
    }

    return 0;
}
