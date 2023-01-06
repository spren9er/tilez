<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';

	export let root: boolean;
	export const element: TypeTilePropsElement | undefined = undefined;

	root;
</script>

<slot {element} />
