import { Context } from "effect";

export class PokeApiUrl extends Context.Tag("PokeApiUrl")<
  PokeApiUrl,
  string
>() {}
