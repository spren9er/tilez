import type {
  TypeTilePropsStack,
  TypeTilePropsAlign,
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
  protected stack?: TypeTilePropsStack;

  protected stackFullSize: number;
  protected fixedFullSize: number;
  protected pctFullSize: number;

  constructor(
    specs: TileSpecs,
    props: TileProps[],
    root: boolean,
    stack?: TypeTilePropsStack,
  ) {
    this.specs = specs;
    this.props = props.map((props, idx) => ({ idx, props }));
    this.root = root;
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

    this.pctFullSize = this.stackFullSize;
  }

  public call(): TileSpecs[] {
    if (this.nProps === 0) return [];

    if (!this.isStack)
      return this.props.map(({ props }) => {
        const [specs] = new (this.constructor as new (
          specs: TileSpecs,
          props: TileProps[],
          root: boolean,
          stack?: TypeTilePropsStack,
        ) => typeof this)(this.specs, [props], this.root, 'horizontal').call();

        return specs;
      });

    if (this.stackFullSize <= 0)
      return Array(this.nProps).fill(
        new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      );

    const specsDimensions = this.calculateSizes();
    return this.applyAlignAndCoords(specsDimensions);
  }

  private calculateSizes(): TypeTileSpecsDimension[] {
    const sizes = [...this.calculatePxSizes(), ...this.calculatePctSizes()];

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

  protected abstract calculatePxSizes(): number[];

  protected abstract calculatePctSizes(): number[];

  protected abstract calculateFixedSize(
    fixedDimension: TilePropsDimensionsAccessor,
    fixedFullSize: number,
  ): number;

  protected abstract applyAlignAndCoords(
    specsDimensions: TypeTileSpecsDimension[],
  ): TileSpecs[];

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
