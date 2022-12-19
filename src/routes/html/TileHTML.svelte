<script lang="ts">
	import { getSpecsContext } from '$lib';

	const specs = getSpecsContext();
</script>

{#if $specs}
	<div
		class="tile"
		style="--width: {$specs.width}px; --height: {$specs.height}px"
	/>
{/if}

<style>
	.tile {
		position: absolute;
		box-sizing: border-box;
		width: var(--width);
		height: var(--height);
		background-color: #dedede;
		border: 1px solid #cccccc;
	}
</style>
