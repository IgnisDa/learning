import { Data, Effect } from "effect";

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

const program = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) yield* new FetchError();
  return yield* jsonResponse(response);
});

const main = program.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json Error"),
  }),
);

Effect.runPromise(main);
