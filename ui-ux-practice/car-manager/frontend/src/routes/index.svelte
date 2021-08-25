<script lang="ts">
	import { operationStore, query } from '@urql/svelte';
	const cars = operationStore(`
		query {
			cars {
				id
				name
			}
		}
		`);
	query(cars);
</script>

<div>
	{#if $cars.fetching}
		<p>Loading...</p>
	{:else if $cars.error}
		<p>Oh no... {$cars.error.message}</p>
	{:else}
		<ul>
			{#each $cars.data.cars as car}
				<li>{car.name}</li>
			{/each}
		</ul>
	{/if}
</div>
