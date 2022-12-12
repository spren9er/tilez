import type {
  TypeTileProps,
  TypeTilePropsAlign,
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
      this.parseAlign(align),
    );
  }

  private parsePadding(padding?: TypeTilePropsDimension) {
    return typeof padding === 'string' ? parseInt(padding) : padding;
  }

  private parseAlign(align?: TypeTilePropsAlign) {
    if (align && !['left', 'right', 'top', 'bottom', 'center'].includes(align))
      throw Error(
        'Tile prop "align" must be one of "left", "right", "top", "bottom", "center"!',
      );

    return align;
  }
}
