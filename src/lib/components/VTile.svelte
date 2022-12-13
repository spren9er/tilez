<script lang="ts">
	import type {
		TypeTilePropsDimension,
		TypeTilePropsAlign,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';

	import Tile from './Tile.svelte';

	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;
</script>

<Tile stack="vertical" {width} {height} {align} {padding} {type}>
	<slot />
</Tile>
