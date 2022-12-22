import type {
  TypeTilePropsStack,
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
  TypeTilePropsType,
  TypeTilePropsMode,
} from '$lib/types/tileProps.type';
import type { TilePropsDimensions } from '$lib/valueObjects/tilePropsDimensions';

export class TilePropsDimensionsAccessor {
  constructor(
    private dimensions: TilePropsDimensions,
    private type: 'width' | 'height',
  ) {}

  public get value() {
    return this.dimensions.valueFor(this.type);
  }

  public get unit() {
    return this.dimensions.unitFor(this.type);
  }

  public get size() {
    if (this.unit === 'px') return this.value;
  }

  public relSize(fullSize: number) {
    if (this.unit === '%') return this.value! * fullSize;
  }

  public compare(props: TileProps) {
    return this.dimensions.compare(props.dimensions, this.type);
  }
}

export class TileProps {
  constructor(
    public dimensions: TilePropsDimensions,
    public stack?: TypeTilePropsStack,
    public type?: TypeTilePropsType,
    public innerPadding?: number,
    public outerPadding?: number,
    public hAlign?: TypeTilePropsHAlign,
    public vAlign?: TypeTilePropsVAlign,
    public mode?: TypeTilePropsMode,
  ) {}

  public dim(type: 'width' | 'height') {
    return new TilePropsDimensionsAccessor(this.dimensions, type);
  }

  public get width() {
    return this.dim('width').size;
  }

  public get height() {
    return this.dim('height').size;
  }
}
