<script lang="ts">
	import Tile from './Tile.svelte';

	import type {
		TypeTilePropsDimension,
		TypeTilePropsAlign,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';

	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;
</script>

<Tile stack="vertical" {width} {height} {align} {padding} {type}>
	<slot />
</Tile>
