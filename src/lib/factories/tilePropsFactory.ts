import type {
  TypeTileProps,
  TypeTilePropsStack,
  TypeTilePropsDimension,
  TypeTilePropsType,
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
} from '$lib/types/tileProps.type';

import { TileProps } from '$lib/valueObjects/tileProps';
import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

export class TilePropsFactory {
  constructor(private rawProps: TypeTileProps) {}

  public build() {
    const {
      width,
      height,
      stack,
      type,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
    } = this.rawProps;

    const propsDimensions = new TilePropsDimensionsFactory(
      width,
      height,
    ).build();

    return new TileProps(
      propsDimensions,
      this.parseStack(stack) || 'none',
      this.parseType(type),
      this.parsePadding(innerPadding),
      this.parsePadding(outerPadding),
      this.parseHAlign(hAlign),
      this.parseVAlign(vAlign),
    );
  }

  private parseStack(stack?: TypeTilePropsStack) {
    if (stack && !['horizontal', 'vertical', 'none'].includes(stack))
      throw Error(
        'Tile prop "stack" must be one of "horizontal", "vertical", "none"!',
      );

    return stack;
  }

  private parseType(type?: TypeTilePropsType) {
    if (type && !['plain', 'html', 'svg'].includes(type))
      throw Error('Tile prop "type" must be one of "plain", "html", "svg"!');

    return type;
  }

  private parsePadding(padding?: TypeTilePropsDimension) {
    return typeof padding === 'string' ? parseInt(padding) : padding;
  }

  private parseHAlign(hAlign?: TypeTilePropsHAlign) {
    if (hAlign && !['left', 'center', 'right'].includes(hAlign))
      throw Error(
        'Tile prop "hAlign" must be one of "left", "center", "right"!',
      );

    return hAlign;
  }

  private parseVAlign(vAlign?: TypeTilePropsVAlign) {
    if (vAlign && !['top', 'center', 'bottom'].includes(vAlign))
      throw Error(
        'Tile prop "vAlign" must be one of "top", "center", "bottom"!',
      );

    return vAlign;
  }
}
