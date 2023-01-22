<script lang="ts">
	import { getTileContext } from '$lib/entities/tileContext';

	const { specs } = getTileContext();

	$: borderWidth = $specs?.hasEmptySize ? '0px' : '1px';
</script>

<div
	class="tile"
	style:width="{$specs.width}px"
	style:height="{$specs.height}px"
	style:border-width={borderWidth}
/>

<style>
	.tile {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background-color: #8f9fa9;

		border-style: solid;
		border-color: #37464e;
	}
</style>
