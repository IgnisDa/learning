<script lang="ts">
	import { initClient } from '@urql/svelte';
	initClient({
		url: 'http://localhost:8000/graphql'
	});
</script>

<slot />
