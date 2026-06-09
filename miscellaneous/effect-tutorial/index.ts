import { Config, Effect, Schema } from "effect";
import dotenv from "dotenv";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";

dotenv.config();

const getPokemon = Effect.gen(function* () {
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
});

const main = getPokemon.pipe(
  Effect.catchTags({
    JsonError: () => Effect.succeed("Json Error"),
    FetchError: () => Effect.succeed("Fetch Error"),
    ParseError: () => Effect.succeed("Parse Error"),
  }),
);

Effect.runPromise(main).then((a) => console.dir(a, { depth: Infinity }));
