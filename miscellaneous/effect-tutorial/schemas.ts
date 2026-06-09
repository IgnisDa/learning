import { Schema } from "effect";

export class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  name: Schema.String,
  order: Schema.Number,
  height: Schema.Number,
  weight: Schema.Number,
}) {}
