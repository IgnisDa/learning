import { Config, Context, Effect, Schema } from "effect";
import type { ConfigError } from "effect/ConfigError";
import type { ParseError } from "effect/ParseResult";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";

interface PokeApiImpl {
  readonly getPokemon: Effect.Effect<
    Pokemon,
    FetchError | JsonError | ParseError | ConfigError
  >;
}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
  static readonly Live = PokeApi.of({
    getPokemon: Effect.gen(function* () {
      const baseUrl = yield* Config.string("BASE_URL");
      const response = yield* Effect.tryPromise({
        catch: () => new FetchError(),
        try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp`),
      });
      if (!response.ok) yield* new FetchError();
      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
      });
      return yield* Schema.decodeUnknown(Pokemon)(json);
    }),
  });
}
