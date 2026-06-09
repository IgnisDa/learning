import { Data, Effect, Schema } from "effect";

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  name: Schema.String,
  order: Schema.Number,
  height: Schema.Number,
  weight: Schema.Number,
}) {}

class JsonError extends Data.TaggedError("JsonError")<{}> {}
class FetchError extends Data.TaggedError("FetchError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp"),
  catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const decodePokemon = Schema.decodeUnknown(Pokemon);

const program = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) yield* new FetchError();
  const json = yield* jsonResponse(response);
  return yield* decodePokemon(json);
});

const main = program.pipe(
  Effect.catchTags({
    JsonError: () => Effect.succeed("Json Error"),
    FetchError: () => Effect.succeed("Fetch Error"),
    ParseError: () => Effect.succeed("Parse Error"),
  }),
);

Effect.runPromise(main).then((a) => console.dir(a, { depth: Infinity }));
