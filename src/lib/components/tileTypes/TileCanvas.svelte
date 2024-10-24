<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
  import type { TileNode } from '$lib/entities/tileNode';

  import { getTileContext } from '$lib/entities/tileContext';

  import TileEmbed from '$lib/components/TileEmbed.svelte';

  interface Props {
    node: TileNode;
    element?: TypeTilePropsElement | undefined;
    children?: Snippet<[unknown]>;
  }

  let { node, element = $bindable(undefined), children }: Props = $props();

  const { specs, context } = getTileContext();

  const { rootType } = node;

  function createSubContext() {
    if (!$context || !$specs) return;

    const dpr = window.devicePixelRatio || 1;
    const ctx = $context as CanvasRenderingContext2D;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate($specs.subRootX * dpr, $specs.subRootY * dpr);
  }

  function resizeCanvasToDisplaySize() {
    if (!$context || !$specs) return;

    const dpr = window.devicePixelRatio || 1;
    const canvas = $context.canvas as HTMLCanvasElement;

    const canvasWidth = Math.round($specs.width * dpr);
    const canvasHeight = Math.round($specs.height * dpr);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    canvas.style.width = `${$specs.width}px`;
    canvas.style.height = `${$specs.height}px`;

    ($context as CanvasRenderingContext2D).scale(dpr, dpr);
  }

  $effect.pre(() => {
    if ($context && $specs) {
      if (rootType) resizeCanvasToDisplaySize();
      createSubContext();
    }
  });
</script>

{#if rootType}
  <TileEmbed {node}>
    <canvas bind:this={element}></canvas>
    {@render children?.({ element })}
  </TileEmbed>
{:else}
  {@render children?.({ element })}
{/if}

<style>
  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
  }
</style>
