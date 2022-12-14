import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileNode } from '$lib/entities/tileNode';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TileNodeFactory } from '$lib/factories/tileNodeFactory';

export function getSpecsContext(): Writable<TileSpecs> {
  return getContext('tilez-specs');
}

export function setNodeContext(props: TypeTileProps) {
  const parent: TileNode = getContext('tilez-nodes');

  const node = new TileNodeFactory(props, parent).build();

  setContext('tilez-nodes', node);
  setSpecsContext('tilez-specs', node);

  return node;
}

function setSpecsContext(name: string, node: TileNode) {
  const specs = writable(node.specs);

  // copy specs from node store
  node.subscribe((_node: TileNode) => {
    specs.update((specs: TileSpecs) => {
      specs = _node.specs!;

      return specs;
    });
  });

  setContext(name, specs);
}
