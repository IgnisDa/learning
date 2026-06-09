import { Effect } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp"),
);

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

const main = fetchRequest.pipe(
  Effect.flatMap(jsonResponse),
  Effect.catchTag("UnknownException", (error) =>
    Effect.succeed(`An error occurred: ${error.message}`),
  ),
);

Effect.runPromise(main);
