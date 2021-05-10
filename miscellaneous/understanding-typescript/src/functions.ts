function add(n1: number, n2: number) {
  return n1 + n2;
}

function printResult(num: number) {
  console.log("Result is " + num);
}

printResult(add(5, 10));

let combineValues: (a: number, b: number) => number = add;

printResult(combineValues(45, 23));
