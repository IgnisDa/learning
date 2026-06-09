import { Console, Effect } from "effect";

const print = Console.log("Hello World");

const printingArray = [print, print, print];

const printIfTrue = (check: boolean, toPrint: Effect.Effect<void>) => {
  if (check) {
    Effect.runSync(toPrint);
  }
};

printIfTrue(true, print);
