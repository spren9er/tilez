<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TypeTileNodeRootType } from '$lib/entities/tileNode';

	export let rootType: TypeTileNodeRootType | undefined = undefined;
	export const element: TypeTilePropsElement | undefined = undefined;

	rootType; // not used
</script>

<slot {element} />
