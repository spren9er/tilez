import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileNode } from '$lib/entities/tileNode';
import { TileSpecs } from '$lib/entities/tileSpecs';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

export class TileNodeFactory {
  private props: TileProps;
  private parent?: TileNode;
  private specs?: TileSpecs;

  constructor(rawProps: TypeTileProps, parent?: TileNode) {
    this.props = new TilePropsFactory(rawProps).build();
    this.parent = parent;

    if (!this.parent) this.specs = this.rootSpecs();
  }

  public build() {
    return new TileNode(this.props, this.parent, this.specs);
  }

  private rootSpecs() {
    const { width, height } = this.props;
    const errorMsg = 'Root tile requires absolute width and height!';

    if (!width || !height) throw new Error(errorMsg);

    return new TileSpecs(width, height, 0, 0, 0, 0);
  }
}
