<style lang="scss">
	@import url('/static/globals.scss');
</style>

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

<div class="bg-gradient-to-br flex flex-col min-h-screen bg-dark-900 debug-screens">
	<!-- navbar -->
	<main class="flex flex-col flex-1">
		<slot />
	</main>
	<!-- footer -->
</div>
