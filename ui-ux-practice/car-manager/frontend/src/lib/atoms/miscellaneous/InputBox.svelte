<script lang="ts">
	export let value: string;
	export let name: string;
	export let required = false;
</script>

<input
	type="text"
	{required}
	id={name}
	bind:value
	data-bound-to={name}
	class="rounded-r-lg rounded-l shadow-lg w-full py-8px px-4px focus:(ring ring-yellow-600) "
/>
