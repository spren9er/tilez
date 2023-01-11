import type {
  TypeTilePropsStack,
  TypeTilePropsAlign,
  TypeTilePropsType,
} from '$lib/types/tileProps.type';
import type { TypeTileSpecsDimension } from '$lib/types/tileSpecs.type';
import type {
  TileProps,
  TilePropsDimensionsAccessor,
} from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/entities/tileSpecs';

type TypeIndexedProps = {
  idx: number;
  props: TileProps;
};

export abstract class TileSpecsCalculation {
  protected specs: TileSpecs;
  protected props: TypeIndexedProps[];
  protected root: boolean;
  protected type: TypeTilePropsType;
  protected stack?: TypeTilePropsStack;

  protected stackFullSize: number;
  protected fixedFullSize: number;
  protected fullSize: number;

  constructor(
    specs: TileSpecs,
    props: TileProps[],
    root: boolean,
    type: TypeTilePropsType,
    stack?: TypeTilePropsStack,
  ) {
    this.specs = specs;
    this.props = props.map((props, idx) => ({ idx, props }));
    this.root = root;
    this.type = type;
    this.stack = stack;

    const { outerPadding } = this.specs;

    this.stackFullSize = Math.max(
      this.specs[this.stackDimension] - 2 * outerPadding,
      0,
    );
    this.fixedFullSize = Math.max(
      this.specs[this.fixedDimension] - 2 * outerPadding,
      0,
    );

    this.fullSize = this.stackFullSize;
  }

  public call(): TileSpecs[] {
    if (this.nProps === 0) return [];

    if (!this.isStack)
      return this.props.map(({ props }) => {
        const [specs] = new (this.constructor as new (
          specs: TileSpecs,
          props: TileProps[],
          root: boolean,
          type: TypeTilePropsType,
          stack?: TypeTilePropsStack,
        ) => typeof this)(
          this.specs,
          [props],
          this.root,
          this.type,
          'horizontal',
        ).call();

        return specs;
      });

    if (this.stackFullSize <= 0)
      return Array(this.nProps).fill(
        new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      );

    const specsDimensions = this.calculateSizes();
    return this.applyAlignAndCoords(specsDimensions);
  }

  private calculateSizes(): TypeTileSpecsDimension[] {
    const sizes = [...this.calculateAbsSizes(), ...this.calculateNonAbsSizes()];

    const specsDimensions = this.sortedProps.map(
      ({ idx, props }, sortedIdx) => {
        const stackSize = sizes[sortedIdx];

        const fixedDimension = props.dim(this.fixedDimension);
        const fixedSize = this.calculateFixedSize(
          fixedDimension,
          this.fixedFullSize,
        );

        return {
          idx,
          specs: {
            [this.stackDimension]: stackSize,
            [this.fixedDimension]: fixedSize,
          } as TypeTileSpecsDimension,
        };
      },
    );

    return specsDimensions
      .sort((a, b) => (a.idx > b.idx ? 1 : -1))
      .map(({ specs }) => specs);
  }

  protected abstract calculateAbsSizes(): number[];

  protected abstract calculateNonAbsSizes(): number[];

  protected calculateRelSizes(
    props: TypeIndexedProps[],
    nonAbsSize: number,
    padding = 0,
  ): number[] {
    return props.map(({ props }) => {
      const stackDimension = props.dim(this.stackDimension);
      const step = Math.min(stackDimension.relSize(nonAbsSize)!, this.fullSize);
      const stackSize = step - padding;

      if (stackSize < 1) return 0;

      this.fullSize -= step;

      return stackSize;
    });
  }

  protected abstract specsFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
    anchor: number,
  ): { idx: number; specs: TileSpecs }[];

  protected abstract stackSizeFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
  ): number;

  protected propsFor(align: TypeTilePropsAlign) {
    return (this.groupedProps.get(align) || []) as TypeIndexedProps[];
  }

  protected applyAlignAndCoords(
    specsDimensions: TypeTileSpecsDimension[],
    padding = 0,
  ): TileSpecs[] {
    const { outerPadding } = this.specs;

    const start = this.isHorizontal ? 'left' : 'top';
    const startSize = this.stackSizeFor(start, specsDimensions);
    const startSpecs = this.specsFor(start, specsDimensions, outerPadding);

    const end = this.isHorizontal ? 'right' : 'bottom';
    const endSize = this.stackSizeFor(end, specsDimensions);
    const endAnchor = outerPadding + this.stackFullSize - endSize;
    const endSpecs = this.specsFor(end, specsDimensions, endAnchor);

    const centerSize = this.stackSizeFor('center', specsDimensions);
    const fullSize = this.stackFullSize + 2 * outerPadding;
    let centerAnchor = (fullSize - centerSize) / 2;

    const startEnd = outerPadding + startSize + padding;
    const endStart = fullSize - outerPadding - endSize - padding;
    const centerEnd = centerAnchor + centerSize;

    if (startEnd > centerAnchor) {
      centerAnchor = startEnd;
    } else if (centerEnd > endStart) {
      centerAnchor = endStart - centerSize;
    }

    const centerSpecs = this.specsFor('center', specsDimensions, centerAnchor);

    return [...startSpecs, ...endSpecs, ...centerSpecs]
      .sort((a, b) => (a.idx > b.idx ? 1 : -1))
      .map(({ specs }) => specs);
  }

  protected calculateFixedSize(
    fixedDimension: TilePropsDimensionsAccessor,
    fixedFullSize: number,
  ) {
    const fixedSize =
      fixedDimension.size ??
      fixedDimension.relSize(fixedFullSize) ??
      fixedFullSize;

    return Math.min(fixedSize, fixedFullSize);
  }

  protected isSubRoot(props: TileProps) {
    return props.type !== this.type;
  }

  protected get groupedProps() {
    return this.props.reduce((agg, { idx, props }) => {
      const align = this.isHorizontal
        ? props.hAlign || 'left'
        : props.vAlign || 'top';

      return agg.set(align, [...(agg.get(align) || []), { idx, props }]);
    }, new Map());
  }

  protected get sortedProps() {
    return [...this.props].sort((a, b) => {
      // reverse order w.r.t. unit ('px' > '%' > undefined)!
      const result = b.props.dim(this.stackDimension).compare(a.props);

      if (result === 0) return a.idx - b.idx; // small indexes first

      return result;
    });
  }

  protected get nProps() {
    return this.props.length;
  }

  protected get stackDimension(): 'width' | 'height' {
    if (this.stack === 'horizontal') return 'width';

    return 'height';
  }

  protected get fixedDimension(): 'width' | 'height' {
    if (this.stack === 'horizontal') return 'height';

    return 'width';
  }

  protected get isHorizontal(): boolean {
    return this.stack === 'horizontal';
  }

  protected get isStack(): boolean {
    return !!this.stack;
  }
}
