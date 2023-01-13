<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { element: elementStore } = getTileContext();

	$: ({ specs, coords } = node);
	$: if (element) elementStore.set(element);
</script>

{#if node.rootType}
	<TileEmbed {node}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={specs?.width}
			height={specs?.height}
			viewBox="0 0 {specs?.width} {specs?.height}"
			bind:this={element}
		>
			<slot {element} />
		</svg>
	</TileEmbed>
{:else}
	<g transform="translate({coords.x}, {coords.y})" bind:this={element}>
		<slot {element} />
	</g>
{/if}

<style>
	svg {
		display: block;
	}
</style>
