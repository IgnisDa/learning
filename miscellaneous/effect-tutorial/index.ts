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

const main = fetchRequest.pipe(
  Effect.filterOrFail(
    (response) => response.ok,
    () => new FetchError(),
  ),
  Effect.flatMap(jsonResponse),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error occurred"),
    JsonError: () => Effect.succeed("JSON parsing error occurred"),
  }),
);

Effect.runPromise(main);
