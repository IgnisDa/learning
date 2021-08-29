<script lang="ts">
	export let value: string;
	export let inputType: string;
	export let name: string;
	export let required = false;
	export let errored = false;

	function typeAction(node: HTMLInputElement) {
		node.type = inputType;
	}
</script>

<input
	use:typeAction
	{required}
	id={name}
	bind:value
	data-bound-to={name}
	class="rounded-r-lg
	appearance-none rounded-l shadow-lg transition-shadow duration-300 w-full py-8px px-4px
	focus:(ring ring-yellow-600 outline-none) {errored ? 'border-l-4 border-red-500' : ''}"
/>
