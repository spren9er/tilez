<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { TypeTileSpecs } from '$lib/types/tileSpecs.type';

  import type {
    TypeTilePropsStack,
    TypeTilePropsDimension,
    TypeTilePropsHAlign,
    TypeTilePropsVAlign,
    TypeTilePropsType,
    TypeTilePropsMode,
    TypeTilePropsElement,
    TypeTilePropsWrapper,
  } from '$lib/types/tileProps.type';
  import type { TileNode } from '$lib/entities/tileNode';
  import type { TileSpecs } from '$lib/entities/tileSpecs';

  import { setNodeContext, getTileContext } from '$lib/entities/tileContext';

  import TileWrapper from '$lib/components/TileWrapper.svelte';
  import TilePlain from '$lib/components/tileTypes/TilePlain.svelte';
  import TileHTML from '$lib/components/tileTypes/TileHTML.svelte';
  import TileSVG from '$lib/components/tileTypes/TileSVG.svelte';
  import TileCanvas from '$lib/components/tileTypes/TileCanvas.svelte';
  import TileWebGL from '$lib/components/tileTypes/TileWebGL.svelte';

  interface Props {
    stack?: TypeTilePropsStack | undefined;
    width?: TypeTilePropsDimension | undefined;
    height?: TypeTilePropsDimension | undefined;
    innerPadding?: TypeTilePropsDimension | undefined;
    outerPadding?: TypeTilePropsDimension | undefined;
    hAlign?: TypeTilePropsHAlign | undefined;
    vAlign?: TypeTilePropsVAlign | undefined;
    type?: TypeTilePropsType | undefined;
    mode?: TypeTilePropsMode | undefined;
    element?: TypeTilePropsElement | undefined;
    wrapper?: TypeTilePropsWrapper | undefined;
    children?: Snippet<[{ element?: TypeTilePropsElement; specs: TileSpecs }]>;
    specs?: TypeTileSpecs;
  }

  let {
    stack = undefined,
    width = undefined,
    height = undefined,
    innerPadding = undefined,
    outerPadding = undefined,
    hAlign = undefined,
    vAlign = undefined,
    type = undefined,
    mode = undefined,
    element = $bindable(undefined),
    wrapper = $bindable(undefined),
    children,
    specs = $bindable(undefined),
  }: Props = $props();

  let containerWidth: number | undefined = $state();
  let containerHeight: number | undefined = $state();
  let init = $state(true);

  const rawProps = {
    width,
    height,
    innerPadding,
    outerPadding,
    hAlign,
    vAlign,
    type,
    mode,
    stack,
  };
  const node = setNodeContext(rawProps);

  const { element: elementStore } = getTileContext();

  const componentFor = (node: TileNode) => {
    const componentMapping = {
      plain: TilePlain,
      html: TileHTML,
      svg: TileSVG,
      canvas: TileCanvas,
      webgl: TileWebGL,
    };

    return componentMapping[node.specs.type];
  };

  $effect(() => {
    specs = $node.specs;
  });

  $effect(() => {
    if (element) elementStore.set(element);
  });

  $effect(() => {
    const rawProps = {
      width,
      height,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
      type,
      mode,
      stack,
    };

    rawProps.width ||= containerWidth;
    rawProps.height ||= containerHeight;

    if (!init) node.updateNodes(rawProps);

    init = false;
  });
</script>

<TileWrapper node={$node} bind:wrapper bind:containerWidth bind:containerHeight>
  {@const SvelteComponent = componentFor($node)}
  <SvelteComponent node={$node} bind:element>
    {@render children?.({
      element,
      specs: $node.specs,
    })}
  </SvelteComponent>
</TileWrapper>
