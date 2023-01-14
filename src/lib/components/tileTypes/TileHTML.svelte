<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	$: ({ specs, coords } = node);
</script>

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

<style>
	.tile,
	slot {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
	}
</style>
