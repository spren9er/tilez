<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs } = getTileContext();
</script>

{#if $specs}
	<div
		class="tile"
		style:width="{$specs.width}px"
		style:height="{$specs.height}px"
	/>
{/if}

<style>
	.tile {
		position: absolute;
		box-sizing: border-box;
		background-color: #eaeaea;
		border: 1px solid #aaaaaa;
	}
</style>
