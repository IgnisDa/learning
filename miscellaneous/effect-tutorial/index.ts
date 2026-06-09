import { Config, Effect, Schema } from "effect";
import dotenv from "dotenv";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokeApi } from "./pokeapi";

dotenv.config();

const getPokemon = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

const main = getPokemon.pipe(
  Effect.catchTags({
    JsonError: () => Effect.succeed("Json Error"),
    FetchError: () => Effect.succeed("Fetch Error"),
    ParseError: () => Effect.succeed("Parse Error"),
  }),
);

Effect.runPromise(main).then((a) => console.dir(a, { depth: Infinity }));
