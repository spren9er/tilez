import { getContext, setContext } from 'svelte';
import { derived, type Writable } from 'svelte/store';

import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileNode } from '$lib/entities/tileNode';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { LinearScale } from '$lib/utils/linearScale';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';

type TypeTileContext = {
  specs: Writable<TileSpecs>;
  xScale: Writable<LinearScale>;
  yScale: Writable<LinearScale>;
};

export function getTileContext(): TypeTileContext {
  return getContext('tilez');
}

export function setNodeContext(props: TypeTileProps) {
  const parent: TileNode = getContext('tilez-nodes');

  const node = new TileNodeFactory(props, parent).build();

  setContext('tilez-nodes', node);
  setTileContext('tilez', node);

  return node;
}

function setTileContext(name: string, node: TileNode) {
  const specs = derived(node, ($node) => $node.specs!);

  const xScale = derived(specs, ($specs) => {
    const width = $specs.width;

    return new LinearScale().range([0, width]);
  });

  const yScale = derived(specs, ($specs) => {
    const height = $specs.height;

    return new LinearScale().range([0, height]);
  });

  setContext(name, { specs, xScale, yScale });
}
