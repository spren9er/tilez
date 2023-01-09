import type { TypeTilePropsDimension } from '$lib/types/tileProps.type';

import { TilePropsDimensions } from '$lib/valueObjects/tilePropsDimensions';
import { TilePropsDimensionFactory } from '$lib/factories/tilePropsDimensionFactory';

export class TilePropsDimensionsFactory {
  constructor(
    private width?: TypeTilePropsDimension,
    private height?: TypeTilePropsDimension,
  ) {}

  public build(): TilePropsDimensions {
    const propsDimensions = [];

    if (this.width !== undefined)
      propsDimensions.push(
        new TilePropsDimensionFactory('width', this.width).build(),
      );

    if (this.height !== undefined)
      propsDimensions.push(
        new TilePropsDimensionFactory('height', this.height).build(),
      );

    return new TilePropsDimensions(propsDimensions);
  }
}
