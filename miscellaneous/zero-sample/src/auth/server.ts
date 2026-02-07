import "dotenv/config";

import { createHash, randomBytes } from "node:crypto";
import { nanoid } from "nanoid";
import postgres from "postgres";

const SESSION_COOKIE = "zero_sample_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

const databaseURL = process.env.DATABASE_URL ?? process.env.ZERO_UPSTREAM_DB;
if (!databaseURL) {
	throw new Error("DATABASE_URL (or ZERO_UPSTREAM_DB) is required");
}

export const sql = postgres(databaseURL, {
	max: 5,
});

export type Session = {
	userID: string;
	email: string;
};

export async function getSession(request: Request): Promise<Session | null> {
	const token = getCookie(request.headers.get("cookie"), SESSION_COOKIE);
	if (!token) {
		return null;
	}

	const now = Date.now();
	const tokenHash = sha256Hex(token);

	const rows = await sql<
		Array<{
			user_id: string;
			email: string;
		}>
	>`
		SELECT s.user_id, u.email
		FROM user_session s
		JOIN app_user u ON u.id = s.user_id
		WHERE s.token_hash = ${tokenHash}
			AND s.expires_at > ${now}
		LIMIT 1
	`;

	const row = rows[0];
	if (!row) {
		return null;
	}

	return {
		email: row.email,
		userID: row.user_id,
	};
}

export async function login(emailRaw: string) {
	const email = normalizeEmail(emailRaw);
	if (!email) {
		throw new Error("Invalid email");
	}

	const now = Date.now();
	const expiresAt = now + SESSION_TTL_MS;
	const token = randomBytes(32).toString("base64url");
	const tokenHash = sha256Hex(token);

	return await sql.begin(async (txRaw) => {
		// `postgres` transaction typings drop call signatures via `Omit<...>`.
		// Cast to the callable `Sql` interface so we can use the tagged template API.
		const tx = txRaw as unknown as postgres.Sql;

		const existing = await tx<
			Array<{
				id: string;
				email: string;
			}>
		>`
			SELECT id, email
			FROM app_user
			WHERE email = ${email}
			LIMIT 1
		`;

		const userID = existing[0]?.id ?? `user_${nanoid(10)}`;

		if (!existing[0]) {
			await tx`
				INSERT INTO app_user (id, email, created_at)
				VALUES (${userID}, ${email}, ${now})
			`;
		}

		await tx`
			INSERT INTO user_session (id, user_id, token_hash, expires_at, created_at)
			VALUES (${`sess_${nanoid(10)}`}, ${userID}, ${tokenHash}, ${expiresAt}, ${now})
		`;

		return {
			email,
			expiresAt,
			token,
			userID,
		};
	});
}

export async function logout(request: Request) {
	const token = getCookie(request.headers.get("cookie"), SESSION_COOKIE);
	if (!token) {
		return;
	}

	const tokenHash = sha256Hex(token);
	await sql`
		DELETE FROM user_session
		WHERE token_hash = ${tokenHash}
	`;
}

export function sessionCookieHeader(props: { token: string; secure: boolean }) {
	const maxAge = Math.floor(SESSION_TTL_MS / 1000);

	return [
		`${SESSION_COOKIE}=${props.token}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		`Max-Age=${maxAge}`,
		props.secure ? "Secure" : null,
	]
		.filter(Boolean)
		.join("; ");
}

export function clearSessionCookieHeader(props: { secure: boolean }) {
	return [
		`${SESSION_COOKIE}=`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		"Max-Age=0",
		props.secure ? "Secure" : null,
	]
		.filter(Boolean)
		.join("; ");
}

function getCookie(cookieHeader: string | null, key: string) {
	if (!cookieHeader) {
		return null;
	}

	const parts = cookieHeader.split(";");
	for (const part of parts) {
		const trimmed = part.trim();
		if (!trimmed) {
			continue;
		}

		const eq = trimmed.indexOf("=");
		if (eq === -1) {
			continue;
		}

		const k = trimmed.slice(0, eq);
		if (k !== key) {
			continue;
		}

		return decodeURIComponent(trimmed.slice(eq + 1));
	}

	return null;
}

function sha256Hex(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string) {
	const trimmed = email.trim().toLowerCase();
	if (!trimmed) {
		return null;
	}

	if (!trimmed.includes("@")) {
		return null;
	}

	return trimmed;
}
