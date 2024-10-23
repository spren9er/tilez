<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	interface Props {
		node: TileNode;
		children?: import('svelte').Snippet<[any]>;
		element?: TypeTilePropsElement;
	}

	let { node, children, element = $bindable(undefined) }: Props = $props();

	node; // not used here
</script>

{@render children?.({ element })}
