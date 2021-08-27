<script lang="ts">
	export let loading = false;
</script>

<button
	data-loading={loading}
	class="rounded-r-lg rounded-l font-semibold bg-gray-600 py-8px px-12px text-24px"
	class:animate-pulse={loading}
>
	<slot />
</button>
