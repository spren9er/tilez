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

  public copy(): TileProps {
    const {
      dimensions,
      stack,
      type,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
      mode,
    } = this;

    return new TileProps(
      dimensions,
      stack,
      type,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
      mode,
    );
  }

  public call(key: string) {
    if (key in this) return this[key as keyof TileProps];
  }

  public isEqualTo(props: TileProps) {
    return [
      'width',
      'height',
      'stack',
      'type',
      'innerPadding',
      'outerPadding',
      'hAlign',
      'vAlign',
      'mode',
    ].every((key) => this.hasSameValue(props, key));
  }

  public hasSameValue(props: TileProps, key: string): boolean {
    if (!['width', 'height'].includes(key))
      return this.call(key) === props.call(key);

    const dimKey = key as 'width' | 'height';
    const dimensionA = this.dimensions.dimensionFor(dimKey);
    const dimensionB = props.dimensions.dimensionFor(dimKey);

    if (!dimensionA && !dimensionB) return true;

    return !!(dimensionA && dimensionB && dimensionA.isEqualTo(dimensionB));
  }
}
