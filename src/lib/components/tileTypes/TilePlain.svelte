<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
  import type { TileNode } from '$lib/entities/tileNode';

  interface Props {
    node: TileNode;
    children?: Snippet<[unknown]>;
    element?: TypeTilePropsElement;
  }

  let { children, element = $bindable(undefined) }: Props = $props();
</script>

{@render children?.({ element })}
