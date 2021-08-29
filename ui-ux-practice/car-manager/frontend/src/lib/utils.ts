export function setAllEmpty(transformObj: {
	[index: string]: string[];
}): { [index: string]: string[] } {
	for (const key in transformObj) {
		transformObj[key] = [];
	}
	return transformObj;
}

/* Use this in any async context by invoking it as `await sleep(durationInMilliseconds)` */
export function sleep(time: number): Promise<void> {
	if (typeof time !== 'number') {
		throw new Error('[frontend-commons]: Only numeric time allowed');
	}
	// eslint-disable-next-line no-console
	console.info(`Sleeping main thread for ${time} milliseconds`);
	return new Promise((resolve) => setTimeout(resolve, time));
}
