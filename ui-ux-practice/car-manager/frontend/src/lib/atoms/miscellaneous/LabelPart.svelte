<script lang="ts">
	export let name: string;
	export let errored = false;
</script>

<label
	for={name}
	class="text-24px text-light-300 capitalize
	{errored ? 'animated animate-duration-200 animate-shake-x' : ''}"
>
	{name}
</label>
