import { Context, Effect, Layer, Schema } from "effect";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokemonCollection } from "./pokemon-collection";
import { BuildPokeApiUrl } from "./build-poke-api-url";

const make = Effect.gen(function* () {
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
});

export class PokeApi extends Context.Tag("PokeApi")<
  PokeApi,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make).pipe(
    Layer.provide(Layer.mergeAll(PokemonCollection.Live, BuildPokeApiUrl.Live)),
  );

  static readonly Mock = Layer.succeed(
    this,
    PokeApi.of({
      getPokemon: Effect.succeed({
        id: 1,
        order: 1,
        height: 10,
        weight: 10,
        name: "my-name",
      }),
    }),
  );
}
