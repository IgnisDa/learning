import { Context } from "effect";

export class BuildPokeApiUrl extends Context.Tag("BuildPokeApiUrl")<
  BuildPokeApiUrl,
  (props: { name: string }) => string
>() {}
