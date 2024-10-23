<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	interface Props {
		node: TileNode;
		element?: TypeTilePropsElement | undefined;
		children?: import('svelte').Snippet<[any]>;
	}

	let { node, element = $bindable(undefined), children }: Props = $props();

	let { specs, coords } = $derived(node);
</script>

<div
	class="tile"
	style:left="{coords.x}px"
	style:top="{coords.y}px"
	style:width="{specs.width}px"
	style:height="{specs.height}px"
	bind:this={element}
>
	{@render children?.({ element })}
</div>

<style>
	.tile {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
	}
</style>
