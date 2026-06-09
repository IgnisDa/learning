import dotenv from "dotenv";
import { Effect, Layer, ManagedRuntime } from "effect";
import { PokeApi } from "./poke-api";

dotenv.config();

const MainLayer = Layer.mergeAll(PokeApi.Default);

const PokemonRuntime = ManagedRuntime.make(MainLayer);

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

const main = program.pipe(
  Effect.catchTags({
    JsonError: () => Effect.succeed("Json Error"),
    FetchError: () => Effect.succeed("Fetch Error"),
    ParseError: () => Effect.succeed("Parse Error"),
  }),
);

PokemonRuntime.runPromise(main).then((a) =>
  console.dir(a, { depth: Infinity }),
);
