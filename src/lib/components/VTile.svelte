<script lang="ts">
	import type {
		TypeTilePropsDimension,
		TypeTilePropsHAlign,
		TypeTilePropsVAlign,
		TypeTilePropsType,
		TypeTilePropsMode,
	} from '$lib/types/tileProps.type';

	import Tile from './Tile.svelte';

	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let innerPadding: TypeTilePropsDimension | undefined = undefined;
	export let outerPadding: TypeTilePropsDimension | undefined = undefined;
	export let hAlign: TypeTilePropsHAlign | undefined = undefined;
	export let vAlign: TypeTilePropsVAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;
	export let mode: TypeTilePropsMode | undefined = undefined;
</script>

<Tile
	stack="vertical"
	{width}
	{height}
	{innerPadding}
	{outerPadding}
	{hAlign}
	{vAlign}
	{type}
	{mode}
>
	<slot />
</Tile>
