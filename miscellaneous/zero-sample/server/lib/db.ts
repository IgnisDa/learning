import postgres from "postgres";
import { databaseURL } from "./common";

export const sql = postgres(databaseURL);
