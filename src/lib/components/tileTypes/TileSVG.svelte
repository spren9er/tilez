<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
  import type { TileNode } from '$lib/entities/tileNode';

  import TileEmbed from '$lib/components/TileEmbed.svelte';

  interface Props {
    node: TileNode;
    element?: TypeTilePropsElement | undefined;
    children?: Snippet<[unknown]>;
  }

  let { node, element = $bindable(undefined), children }: Props = $props();

  let { specs, coords, rootType } = $derived(node);
</script>

{#if rootType}
  <TileEmbed {node}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={specs.width}
      height={specs.height}
      viewBox="0 0 {specs.width} {specs.height}"
      bind:this={element}
    >
      {@render children?.({ element })}
    </svg>
  </TileEmbed>
{:else}
  <g transform="translate({coords.x}, {coords.y})" bind:this={element}>
    {@render children?.({ element })}
  </g>
{/if}

<style>
  svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
  }
</style>
