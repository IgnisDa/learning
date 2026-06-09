import { Data } from "effect";

export class JsonError extends Data.TaggedError("JsonError")<{}> {}
export class FetchError extends Data.TaggedError("FetchError")<{}> {}
