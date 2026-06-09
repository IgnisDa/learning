import { Effect } from "effect";
import { PokeApiUrl } from "./poke-api-url";

export class BuildPokeApiUrl extends Effect.Service<BuildPokeApiUrl>()(
  "BuildPokeApiUrl",
  {
    dependencies: [PokeApiUrl.Live],
    effect: Effect.gen(function* () {
      const pokeApiUrl = yield* PokeApiUrl;
      return ({ name }: { name: string }) => `${pokeApiUrl}/${name}`;
    }),
  },
) {}
