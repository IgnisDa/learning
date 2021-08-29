<script lang="ts">
	import InputBox from '$lib/atoms/miscellaneous/InputBox.svelte';
	import LabelPart from '$lib/atoms/miscellaneous/LabelPart.svelte';

	import { flip } from 'svelte/animate';
	import { fly, slide } from 'svelte/transition';

	export let value: string;
	export let name: string;
	export let inputType: 'text' | 'password' | 'email' = 'text';
	export let required = true;
	export let errored = false;
	export let errors: string[] = [];
</script>

<div class="space-y-8px">
	<div>
		<LabelPart {errored} {name} />
	</div>
	<div>
		<InputBox {errored} bind:value {name} {required} {inputType} />
	</div>
	{#if errored}
		<div class="text-red-400">
			{#each errors as error, i (i)}
				<p animate:flip in:fly={{ y: 100 }} out:slide={{ duration: 250 }}>{error}</p>
			{/each}
		</div>
	{/if}
</div>
