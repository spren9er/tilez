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
	style="
      --top: {$specs.relY}px;
      --left: {$specs.relX}px;
      --width: {$specs.width}px;
      --height: {$specs.height}px"
	bind:this={element}
>
	<slot {element} />
</div>

<style>
	.tile {
		position: absolute;
		top: var(--top);
		left: var(--left);
		width: var(--width);
		height: var(--height);
		margin: 0;
		padding: 0;
	}

	.root.tile {
		position: relative;
	}
</style>
