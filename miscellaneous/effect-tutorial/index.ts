import { Console, Effect } from "effect";

const main = Console.log("Hello World");

Effect.runSync(main);
