export function getErrorMessage(error: unknown, fallback: string) {
	if (error instanceof Error) {
		const message = error.message.trim();
		if (message) {
			return message;
		}
	}

	if (typeof error === "string") {
		const message = error.trim();
		if (message) {
			return message;
		}
	}

	if (error && typeof error === "object") {
		const record = error as Record<string, unknown>;

		const message = record.message;
		if (typeof message === "string" && message.trim()) {
			return message;
		}

		const nestedError = record.error;
		if (typeof nestedError === "string" && nestedError.trim()) {
			return nestedError;
		}

		const issues = record.issues;
		if (Array.isArray(issues)) {
			const issueMessages = issues
				.map((issue) => {
					if (issue && typeof issue === "object" && "message" in issue) {
						const issueMessage = (issue as { message?: unknown }).message;
						return typeof issueMessage === "string"
							? issueMessage.trim()
							: "";
					}

					return "";
				})
				.filter(Boolean);

			if (issueMessages.length) {
				return issueMessages.join(", ");
			}
		}
	}

	return fallback;
}
