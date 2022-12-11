import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileSpecs } from '$lib/valueObjects/tileSpecs';

import { TileNode } from '$lib/entities/tileNode';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

export class TileNodeFactory {
  constructor(
    private rawProps: TypeTileProps,
    private opts: { specs?: TileSpecs; parentNode?: TileNode },
  ) {}

  public build() {
    const props = new TilePropsFactory(this.rawProps).build();
    const { specs, parentNode } = this.opts;

    return new TileNode(props, specs, parentNode);
  }
}
