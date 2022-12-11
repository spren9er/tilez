import type {
  TypeTilePropsStack,
  TypeTilePropsAlign,
} from '$lib/types/tileProps.type';
import type { TilePropsDimensions } from '$lib/valueObjects/tilePropsDimensions';

export class TileProps {
  constructor(
    private dimensions: TilePropsDimensions,
    public stack?: TypeTilePropsStack,
    public padding?: number,
    public align?: TypeTilePropsAlign,
  ) {}

  public get width() {
    return this.valueFor('width');
  }

  public get height() {
    return this.valueFor('height');
  }

  public valueFor(type: 'width' | 'height') {
    return this.dimensions.valueFor(type);
  }

  public unitFor(type: 'width' | 'height') {
    return this.dimensions.unitFor(type);
  }

  public compare(props: TileProps, type: 'width' | 'height') {
    return this.dimensions.compare(props.dimensions, type);
  }
}
