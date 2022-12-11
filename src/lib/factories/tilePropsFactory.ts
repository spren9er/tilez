import type {
  TypeTileProps,
  TypeTilePropsDimension,
} from '$lib/types/tileProps.type';

import { TileProps } from '$lib/valueObjects/tileProps';
import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

export class TilePropsFactory {
  constructor(private rawProps: TypeTileProps) {}

  public build() {
    const { width, height, stack, align, padding } = this.rawProps;

    const propsDimensions = new TilePropsDimensionsFactory(
      width,
      height,
    ).build();

    return new TileProps(
      propsDimensions,
      stack,
      this.parsePadding(padding),
      align,
    );
  }

  private parsePadding(padding?: TypeTilePropsDimension) {
    return typeof padding === 'string' ? parseInt(padding) : padding;
  }
}
