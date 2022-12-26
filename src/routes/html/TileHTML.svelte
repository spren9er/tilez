<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs } = getTileContext();
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
