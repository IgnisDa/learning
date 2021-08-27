<script lang="ts">
	import InputBox from '$lib/atoms/miscellaneous/InputBox.svelte';
	import LabelPart from '$lib/atoms/miscellaneous/LabelPart.svelte';

	export let value: string;
	export let name: string;
	export let required = false;
</script>

<div>
	<div>
		<LabelPart {name} />
	</div>
	<div>
		<InputBox bind:value {name} {required} />
	</div>
</div>
