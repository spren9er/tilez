<script lang="ts">
	import type {
		TypeTilePropsDimension,
		TypeTilePropsHAlign,
		TypeTilePropsVAlign,
		TypeTilePropsType,
		TypeTilePropsMode,
		TypeTilePropsElement,
		TypeTilePropsWrapper,
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
	export let element: TypeTilePropsElement | undefined = undefined;
	export let wrapper: TypeTilePropsWrapper | undefined = undefined;
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
	bind:wrapper
	bind:element
>
	<slot {element} />
</Tile>
