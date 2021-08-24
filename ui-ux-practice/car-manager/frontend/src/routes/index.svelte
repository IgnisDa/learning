<script lang="ts">
	import { operationStore, query } from '@urql/svelte';
	const carsOperation = operationStore(`
		query {
			cars {
				id
				name
			}
		}
		`);
	const cars = query(carsOperation);
</script>

Prerender this page
{JSON.stringify($cars.data.cars)}
