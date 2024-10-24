<script lang="ts">
  import type { Snippet } from 'svelte';

  import { onMount } from 'svelte';

  import type { TypeTilePropsWrapper } from '$lib/types/tileProps.type';

  import type { TileNode } from '$lib/entities/tileNode';

  interface Props {
    node: TileNode;
    containerWidth?: number | undefined;
    containerHeight?: number | undefined;
    wrapper?: TypeTilePropsWrapper | undefined;
    children?: Snippet;
  }

  let {
    node,
    containerWidth = $bindable(undefined),
    containerHeight = $bindable(undefined),
    wrapper = $bindable(undefined),
    children,
  }: Props = $props();

  const { specs, isRoot } = node;
  const width = specs.width ? `${specs.width}px` : null;
  const height = specs.height ? `${specs.height}px` : null;

  let visible = $state(false);

  onMount(() => {
    visible = true;
  });
</script>

{#if isRoot}
  <div
    class="tile-wrapper"
    class:visible
    style:width
    style:height
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={wrapper}
  >
    {#if !node.specs.hasEmptySize}
      {@render children?.()}
    {/if}
  </div>
{:else}
  {@render children?.()}
{/if}

<style>
  .tile-wrapper {
    position: relative;
    visibility: hidden;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .tile-wrapper.visible {
    visibility: visible;
  }
</style>
