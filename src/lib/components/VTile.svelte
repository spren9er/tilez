<script lang="ts">
	import Tile from './Tile.svelte';

	import type {
		TypeTilePropsDimension,
		TypeTilePropsAlign,
	} from '$lib/types/tileProps.type';

	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign = 'center';
</script>

<Tile stack="vertical" {width} {height} {align} {padding}>
	<slot />
</Tile>
