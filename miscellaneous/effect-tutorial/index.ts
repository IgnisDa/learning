import dotenv from "dotenv";
import { Effect, Layer } from "effect";
import { PokeApi } from "./poke-api";

dotenv.config();

const MainLayer = Layer.mergeAll(PokeApi.Default);

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(Effect.provide(MainLayer));

const main = runnable.pipe(
  Effect.catchTags({
    JsonError: () => Effect.succeed("Json Error"),
    FetchError: () => Effect.succeed("Fetch Error"),
    ParseError: () => Effect.succeed("Parse Error"),
  }),
);

Effect.runPromise(main).then((a) => console.dir(a, { depth: Infinity }));
