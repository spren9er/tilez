<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	export let node: TileNode;
	export const element: TypeTilePropsElement | undefined = undefined;

	node; // not used
</script>

<slot {element} />
