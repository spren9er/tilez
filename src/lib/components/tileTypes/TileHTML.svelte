<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';

	import { getTileContext } from '$lib/entities/tileContext';
	import type { TileNode } from '$lib/entities/tileNode';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, element: elementStore } = getTileContext();

	$: if (element) elementStore.set(element);
</script>

{#if $specs}
	<div
		class:root={node.isRoot}
		class="tile"
		style:left="{$specs.parentX}px"
		style:top="{$specs.parentY}px"
		style:width="{$specs.width}px"
		style:height="{$specs.height}px"
		bind:this={element}
	>
		<slot {element} />
	</div>
{/if}

<style>
	.tile {
		position: absolute;
		margin: 0;
		padding: 0;
	}

	.root.tile {
		position: relative;
	}
</style>
