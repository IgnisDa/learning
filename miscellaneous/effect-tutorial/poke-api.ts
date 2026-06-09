import { Context, Effect, Schema } from "effect";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokemonCollection } from "./pokemon-collection";
import { BuildPokeApiUrl } from "./build-poke-api-url";

const make = {
  getPokemon: Effect.gen(function* () {
    const pokemonCollection = yield* PokemonCollection;
    const buildPokeApiUrl = yield* BuildPokeApiUrl;
    const requestUrl = buildPokeApiUrl({
      name: pokemonCollection[0],
    });
    const response = yield* Effect.tryPromise({
      catch: () => new FetchError(),
      try: () => fetch(requestUrl),
    });
    if (!response.ok) yield* new FetchError();
    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new JsonError(),
    });
    return yield* Schema.decodeUnknown(Pokemon)(json);
  }),
};

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, typeof make>() {
  static readonly Live = PokeApi.of(make);
}
