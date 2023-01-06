import { getContext, setContext } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';

import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileNode } from '$lib/entities/tileNode';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { LinearScale } from '$lib/utils/linearScale';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';

const TILEZ_CONTEXT_NAME = 'tilez';
const TILEZ_NODES_CONTEXT_NAME = 'tilez-nodes';

type TypeTileContext = {
  specs: Writable<TileSpecs>;
  xScale: Writable<LinearScale>;
  yScale: Writable<LinearScale>;
  element: Writable<HTMLElement | SVGElement | null>;
};

export function getTileContext(): TypeTileContext {
  return getContext(TILEZ_CONTEXT_NAME);
}

export function setNodeContext(props: TypeTileProps) {
  const parent: TileNode = getContext(TILEZ_NODES_CONTEXT_NAME);

  const node = new TileNodeFactory(props, parent).build();

  setContext(TILEZ_NODES_CONTEXT_NAME, node);
  setTileContext(TILEZ_CONTEXT_NAME, node);

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

  const element = writable(null);

  setContext(name, { specs, xScale, yScale, element });
}
