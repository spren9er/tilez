<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';

	import { getTileContext } from '$lib/entities/tileContext';

	export let root: boolean;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, element: elementStore } = getTileContext();

	$: if (element) elementStore.set(element);
</script>

<div
	class:root
	class="tile"
	style:top={$specs.relY}
	style:left={$specs.relX}
	style:width={$specs.width}
	style:height={$specs.height}
	bind:this={element}
>
	<slot {element} />
</div>

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
