import { Effect, Schema } from "effect";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokemonCollection } from "./pokemon-collection";
import { BuildPokeApiUrl } from "./build-poke-api-url";

export class PokeApi extends Effect.Service<PokeApi>()("PokeApi", {
  dependencies: [BuildPokeApiUrl.Default, PokemonCollection.Default],
  effect: Effect.gen(function* () {
    const buildPokeApiUrl = yield* BuildPokeApiUrl;
    const pokemonCollection = yield* PokemonCollection;

    return {
      getPokemon: Effect.gen(function* () {
        const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });
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
  }),
}) {}
