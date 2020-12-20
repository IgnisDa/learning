You are given a sorted array of numbers, and followed by number of queries, for each query if the queried number is present in the array print its position, else print -1.

Input
First line contains N Q, number of elements in the array and number of queries to follow,

Second line contains N numbers, elements of the array, each number will be -10^9<= ai <= 10^9, 0 < N <= 10^5, 0 < Q <= 5\*10^5

Output
For each element in the query, print the elements 0 based location of its first occurrence, if present, otherwise print -1.

Example

Input:
5 4
2 4 7 7 9
7
10
4
2

Output:
2
-1
1
0
