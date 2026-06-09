import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./node";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
