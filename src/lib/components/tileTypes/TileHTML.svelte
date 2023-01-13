<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { element: elementStore } = getTileContext();

	$: ({ specs, coords } = node);
	$: if (element) elementStore.set(element);
</script>

{#if node.specs}
	<div
		class="tile"
		style:left="{coords.x}px"
		style:top="{coords.y}px"
		style:width="{specs?.width}px"
		style:height="{specs?.height}px"
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
</style>
