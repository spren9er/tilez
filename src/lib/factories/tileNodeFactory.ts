import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileNode } from '$lib/entities/tileNode';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

export class TileNodeFactory {
  private props: TileProps;
  private parent?: TileNode;

  constructor(rawProps: TypeTileProps, parent?: TileNode) {
    this.props = new TilePropsFactory(rawProps).build();
    this.parent = parent;
  }

  public build() {
    return new TileNode(this.props, this.parent);
  }
}
