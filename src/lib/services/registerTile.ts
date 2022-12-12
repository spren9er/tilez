import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileNode } from '$lib/entities/tileNode';
import type { TileSpecs } from '$lib/valueObjects/tileSpecs';

import { TileNodeFactory } from '$lib/factories/tileNodeFactory';

class TileRegistration {
  private props: TypeTileProps;
  private parent: TileNode;

  constructor(props: TypeTileProps, parent: TileNode) {
    this.props = props;
    this.parent = parent;
  }

  public call() {
    const node = new TileNodeFactory(this.props, this.parent).build();

    return node;
  }
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

export function registerTile(props: TypeTileProps) {
  const parent: TileNode = getContext('tilez-node');

  const node = new TileRegistration(props, parent).call();

  setContext('tilez-node', node);
  setSpecsContext('tilez', node);

  return node;
}
