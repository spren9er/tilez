<script lang="ts">
  import type { Snippet } from 'svelte';

  import type {
    TypeTilePropsDimension,
    TypeTilePropsHAlign,
    TypeTilePropsVAlign,
    TypeTilePropsType,
    TypeTilePropsMode,
    TypeTilePropsElement,
    TypeTilePropsWrapper,
  } from '$lib/types/tileProps.type';
  import type { TileSpecs } from '$lib/entities/tileSpecs';

  import Tile from './Tile.svelte';

  interface Props {
    width?: TypeTilePropsDimension | undefined;
    height?: TypeTilePropsDimension | undefined;
    innerPadding?: TypeTilePropsDimension | undefined;
    outerPadding?: TypeTilePropsDimension | undefined;
    hAlign?: TypeTilePropsHAlign | undefined;
    vAlign?: TypeTilePropsVAlign | undefined;
    type?: TypeTilePropsType | undefined;
    mode?: TypeTilePropsMode | undefined;
    specs?: TileSpecs | undefined;
    element?: TypeTilePropsElement | undefined;
    wrapper?: TypeTilePropsWrapper | undefined;
    children?: Snippet<[{ specs?: TileSpecs; element?: TypeTilePropsElement }]>;
  }

  let {
    width = undefined,
    height = undefined,
    innerPadding = undefined,
    outerPadding = undefined,
    hAlign = undefined,
    vAlign = undefined,
    type = undefined,
    mode = undefined,
    specs = $bindable(undefined),
    element = $bindable(undefined),
    wrapper = $bindable(undefined),
    children,
  }: Props = $props();
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
  bind:specs
  bind:element
  bind:wrapper
>
  {@render children?.({ specs, element })}
</Tile>
