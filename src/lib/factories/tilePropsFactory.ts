import type {
  TypeTileProps,
  TypeTilePropsStack,
  TypeTilePropsAlign,
  TypeTilePropsDimension,
  TypeTilePropsType,
} from '$lib/types/tileProps.type';

import { TileProps } from '$lib/valueObjects/tileProps';
import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

export class TilePropsFactory {
  constructor(private rawProps: TypeTileProps) {}

  public build() {
    const { width, height, stack, align, type, padding } = this.rawProps;

    const propsDimensions = new TilePropsDimensionsFactory(
      width,
      height,
    ).build();

    return new TileProps(
      propsDimensions,
      this.parseStack(stack) || 'none',
      this.parseAlign(align) || 'center',
      this.parseType(type),
      this.parsePadding(padding),
    );
  }

  private parseStack(stack?: TypeTilePropsStack) {
    if (stack && !['horizontal', 'vertical', 'none'].includes(stack))
      throw Error(
        'Tile prop "stack" must be one of "horizontal", "vertical", "none"!',
      );

    return stack;
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

  private parseType(type?: TypeTilePropsType) {
    if (type && !['plain', 'html', 'svg'].includes(type))
      throw Error('Tile prop "type" must be one of "plain", "html", "svg"!');

    return type;
  }
}
