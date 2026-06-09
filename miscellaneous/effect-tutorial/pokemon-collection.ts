import { Context, type Array } from "effect";

export class PokemonCollection extends Context.Tag("PokemonCollection")<
  PokemonCollection,
  Array.NonEmptyArray<string>
>() {
  static readonly Live = PokemonCollection.of([
    "staryu",
    "perrserker",
    "flaaffy",
  ]);
}
