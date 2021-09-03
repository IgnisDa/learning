<script lang="ts">
	import { getAllCars } from '$lib/api/index/queries';
	import { operationStore, query } from '@urql/svelte';

	const cars = operationStore(getAllCars);
	query(cars);
</script>

<div class="text-light-50">
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
