<script lang="ts">
	export let loading = false;
	export let success = false;
</script>

<button
	data-loading={loading}
	class="rounded-r-lg rounded-l transition-colors font-semibold py-8px px-12px text-24px
	{success ? 'bg-lime-600' : 'bg-gray-600'}"
	class:animate-pulse={loading}
>
	<slot />
</button>
