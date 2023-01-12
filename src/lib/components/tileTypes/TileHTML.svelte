<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TypeTileNodeRootType } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	export let rootType: TypeTileNodeRootType | undefined = undefined;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, element: elementStore } = getTileContext();

	rootType; // not used

	$: if (element) elementStore.set(element);
</script>

{#if $specs}
	<div
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
</style>
