<script lang="ts">
	import type {
		TypeTilePropsDimension,
		TypeTilePropsAlign,
	} from '$lib/types/tileProps.type';

	import Tile from './Tile.svelte';

	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign = 'center';
</script>

<Tile stack="horizontal" {width} {height} {align} {padding}>
	<slot />
</Tile>
