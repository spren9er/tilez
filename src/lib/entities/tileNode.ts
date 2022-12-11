import { get, type Writable } from 'svelte/store';

import type { TileProps } from '$lib/valueObjects/tileProps';
import type { TileSpecs } from '$lib/valueObjects/tileSpecs';

import { CalculateSpecs } from '$lib/services/calculateSpecs';

export class TileNode {
  public props: TileProps;
  public specs?: TileSpecs;
  private children: Writable<TileNode>[];
  private parentNode?: TileNode;

  constructor(props: TileProps, specs?: TileSpecs, parentNode?: TileNode) {
    this.props = props;
    this.specs = specs;
    this.parentNode = parentNode;
    this.children = [];
  }

  public updateChildrenSpecs() {
    const specs = new CalculateSpecs(this).call();

    if (specs.length === 0) return;

    this.children.forEach((store, idx) => {
      store.update((node: TileNode) => {
        node.specs = specs[idx];

        return node;
      });
    });
  }

  public get hasChildren() {
    return this.children.length > 0;
  }

  public get isRoot() {
    return !this.parentNode;
  }

  public get width() {
    return this.specs?.width;
  }

  public get height() {
    return this.specs?.height;
  }

  public get childrenProps() {
    return this.children.map((store) => get(store).props);
  }

  public addChild(store: Writable<TileNode>) {
    this.children = [...this.children, store];
  }
}
