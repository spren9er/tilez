<script lang="ts">
	import { getTileContext } from '$lib/entities/tileContext';

	const { specs } = getTileContext();

	$: borderWidth = $specs.hasEmptySize ? '0px' : '1px';
</script>

{#if $specs}
	<div
		class="tile"
		style:width="{$specs.width}px"
		style:height="{$specs.height}px"
		style:border-width={borderWidth}
	/>
{/if}

<style>
	.tile {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background-color: #eaeaea;
		border-style: solid;
		border-color: #aaaaaa;
	}
</style>
