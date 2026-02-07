import type { Row } from "@rocicorp/zero";
import { createBuilder } from "@rocicorp/zero";

export type EnrichState = "queued" | "running" | "ready" | "error";
export type CreditKind = "cast" | "crew";
export type OutboxStatus = "pending" | "running" | "done" | "error";
export type ZeroContext = { userID: string };

const showTable = {
	name: "show",
	columns: {
		id: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		tmdbId: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "tmdb_id",
		},
		name: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		overview: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
		},
		posterPath: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "poster_path",
		},
		enrichState: {
			type: "string",
			optional: false,
			customType: null as unknown as EnrichState,
			serverName: "enrich_state",
		},
		enrichError: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "enrich_error",
		},
		enrichedAt: {
			type: "number",
			optional: true,
			customType: null as unknown as number,
			serverName: "enriched_at",
		},
	},
	primaryKey: ["id"],
} as const;

const userShowTable = {
	name: "userShow",
	columns: {
		userId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "user_id",
		},
		showId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "show_id",
		},
		addedAt: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "added_at",
		},
	},
	primaryKey: ["userId", "showId"],
	serverName: "user_show",
} as const;

const seasonTable = {
	name: "season",
	columns: {
		id: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		showId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "show_id",
		},
		seasonNumber: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "season_number",
		},
		name: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		overview: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
		},
		posterPath: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "poster_path",
		},
		episodeCount: {
			type: "number",
			optional: true,
			customType: null as unknown as number,
			serverName: "episode_count",
		},
		airDate: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "air_date",
		},
	},
	primaryKey: ["id"],
} as const;

const personTable = {
	name: "person",
	columns: {
		id: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		tmdbPersonId: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "tmdb_person_id",
		},
		name: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		profilePath: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "profile_path",
		},
	},
	primaryKey: ["id"],
} as const;

const episodeTable = {
	name: "episode",
	columns: {
		id: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		seasonId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "season_id",
		},
		episodeNumber: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "episode_number",
		},
		name: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		overview: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
		},
		stillPath: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "still_path",
		},
		airDate: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "air_date",
		},
		runtime: {
			type: "number",
			optional: true,
			customType: null as unknown as number,
		},
	},
	primaryKey: ["id"],
} as const;

const creditTable = {
	name: "credit",
	columns: {
		id: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		showId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "show_id",
		},
		personId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "person_id",
		},
		kind: {
			type: "string",
			optional: false,
			customType: null as unknown as CreditKind,
		},
		character: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
		},
		job: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
		},
		department: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
		},
		orderIndex: {
			type: "number",
			optional: true,
			customType: null as unknown as number,
			serverName: "order_index",
		},
	},
	primaryKey: ["id"],
} as const;

const outboxTable = {
	name: "outbox",
	columns: {
		id: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		topic: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
		},
		showId: {
			type: "string",
			optional: false,
			customType: null as unknown as string,
			serverName: "show_id",
		},
		tmdbId: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "tmdb_id",
		},
		status: {
			type: "string",
			optional: false,
			customType: null as unknown as OutboxStatus,
		},
		attempts: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
		},
		lockedAt: {
			type: "number",
			optional: true,
			customType: null as unknown as number,
			serverName: "locked_at",
		},
		lastError: {
			type: "string",
			optional: true,
			customType: null as unknown as string,
			serverName: "last_error",
		},
		createdAt: {
			type: "number",
			optional: false,
			customType: null as unknown as number,
			serverName: "created_at",
		},
	},
	primaryKey: ["id"],
} as const;

const showRelationships = {
	seasons: [
		{
			sourceField: ["id"],
			destField: ["showId"],
			destSchema: "season",
			cardinality: "many",
		},
	],
	credits: [
		{
			sourceField: ["id"],
			destField: ["showId"],
			destSchema: "credit",
			cardinality: "many",
		},
	],
	userShows: [
		{
			sourceField: ["id"],
			destField: ["showId"],
			destSchema: "userShow",
			cardinality: "many",
		},
	],
} as const;

const userShowRelationships = {
	show: [
		{
			sourceField: ["showId"],
			destField: ["id"],
			destSchema: "show",
			cardinality: "one",
		},
	],
} as const;

const seasonRelationships = {
	show: [
		{
			sourceField: ["showId"],
			destField: ["id"],
			destSchema: "show",
			cardinality: "one",
		},
	],
	episodes: [
		{
			sourceField: ["id"],
			destField: ["seasonId"],
			destSchema: "episode",
			cardinality: "many",
		},
	],
} as const;

const episodeRelationships = {
	season: [
		{
			sourceField: ["seasonId"],
			destField: ["id"],
			destSchema: "season",
			cardinality: "one",
		},
	],
} as const;

const personRelationships = {
	credits: [
		{
			sourceField: ["id"],
			destField: ["personId"],
			destSchema: "credit",
			cardinality: "many",
		},
	],
} as const;

const creditRelationships = {
	show: [
		{
			sourceField: ["showId"],
			destField: ["id"],
			destSchema: "show",
			cardinality: "one",
		},
	],
	person: [
		{
			sourceField: ["personId"],
			destField: ["id"],
			destSchema: "person",
			cardinality: "one",
		},
	],
} as const;

export const schema = {
	tables: {
		show: showTable,
		userShow: userShowTable,
		season: seasonTable,
		episode: episodeTable,
		person: personTable,
		credit: creditTable,
		outbox: outboxTable,
	},
	relationships: {
		show: showRelationships,
		userShow: userShowRelationships,
		season: seasonRelationships,
		episode: episodeRelationships,
		person: personRelationships,
		credit: creditRelationships,
	},
	enableLegacyQueries: false,
	enableLegacyMutators: false,
} as const;

export type Schema = typeof schema;

export type Show = Row["show"];
export type UserShow = Row["userShow"];
export type Season = Row["season"];
export type Episode = Row["episode"];
export type Person = Row["person"];
export type Credit = Row["credit"];
export type Outbox = Row["outbox"];

export const zql = createBuilder(schema);

declare module "@rocicorp/zero" {
	interface DefaultTypes {
		context: ZeroContext;
		schema: Schema;
	}
}
