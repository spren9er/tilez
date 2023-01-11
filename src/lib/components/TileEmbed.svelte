<script lang="ts">
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	export let node: TileNode;

	const { specs } = getTileContext();
</script>

{#if !node.isRoot && node.isSubRoot}
	<div
		class="tile"
		style:left="{$specs.parentX}px"
		style:top="{$specs.parentY}px"
		style:width="{$specs.width}px"
		style:height="{$specs.height}px"
	>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style>
	.tile {
		position: absolute;
		margin: 0;
		padding: 0;
	}
</style>
