<script lang="ts">
	import 'virtual:windi.css';
	import { initClient } from '@urql/svelte';
	import { API_BASE_URL } from '$lib/env-vars';

	import { browser, dev } from '$app/env';
	// @ts-expect-error
	if (browser && dev) import('virtual:windi-devtools');
	initClient({
		url: `${API_BASE_URL}/graphql`
	});
</script>

<div class="flex flex-col min-h-screen debug-screens">
	<!-- navbar -->
	<main class="flex flex-col flex-1">
		<slot />
	</main>
	<!-- footer -->
</div>
