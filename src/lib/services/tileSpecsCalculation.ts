import type {
  TypeTilePropsStack,
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
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

type TypeTilePropsAlign = TypeTilePropsHAlign | TypeTilePropsVAlign;

export class TileSpecsCalculation {
  private stack: TypeTilePropsStack;
  private specs: TileSpecs;
  private props: TypeIndexedProps[];

  private stackFullSize: number;
  private fixedFullSize: number;
  private pctFullSize: number;
  private firstTile: boolean;

  constructor(stack: TypeTilePropsStack, specs: TileSpecs, props: TileProps[]) {
    this.stack = stack;
    this.specs = specs;
    this.props = props.map((props, idx) => ({ idx, props }));

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
    this.firstTile = true;
  }

  public call(): TileSpecs[] {
    if (this.nProps === 0) return [];

    if (!this.isStack)
      return this.props.map(({ props }) => {
        const specs = new TileSpecsCalculation('horizontal', this.specs, [
          props,
        ]).call();

        return specs[0];
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

  private calculatePxSizes(): number[] {
    const { innerPadding } = this.specs;

    const pxProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit === 'px';
    });

    return pxProps.map(({ props }) => {
      if (this.pctFullSize <= innerPadding) return 0;

      const stackDimension = props.dim(this.stackDimension);
      const stackSize = Math.min(
        stackDimension.size!,
        this.firstTile ? this.pctFullSize : this.pctFullSize - innerPadding,
      );

      const step = this.firstTile ? stackSize : innerPadding + stackSize;

      if (stackSize > 0) {
        this.pctFullSize -= step;
        this.firstTile = false;
      }

      return stackSize;
    });
  }

  private calculatePctSizes(): number[] {
    const { innerPadding } = this.specs;

    const pctProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit !== 'px';
    });
    const maxPctSpecs = pctProps.length;

    // there are already some px tiles (add single inner padding add the end)
    if (!this.firstTile) this.pctFullSize -= innerPadding;

    if (this.pctFullSize < 1) return new Array(maxPctSpecs).fill(0);

    let sizes: number[] = [];
    Array.from({ length: maxPctSpecs }, (_, i) => i + 1)
      .reverse()
      .every((n) => {
        sizes = [];

        const padding = (n - 1) * innerPadding;
        const fullSize = this.pctFullSize - padding;
        let availableSize = fullSize;
        let flexFullSize = availableSize;

        let nPctTiles = 0;
        let success = true;

        pctProps.every(({ props }, idx) => {
          if (idx >= n) {
            sizes.push(0);
            return true;
          }

          if (availableSize < 1) {
            success = false;
            return false;
          }

          const stackDimension = props.dim(this.stackDimension);

          let stackSize: number;
          if (stackDimension.unit === '%') {
            stackSize = stackDimension.relSize(fullSize)!;
            stackSize = Math.min(stackSize, availableSize);
            nPctTiles += 1;
            flexFullSize -= stackSize;
          } else {
            const nFlexTiles = n - nPctTiles;
            stackSize = flexFullSize / nFlexTiles;

            if (nFlexTiles <= 0 || stackSize < 1) {
              success = false;
              return false;
            }
          }

          availableSize -= stackSize;
          sizes.push(stackSize);

          return true;
        });

        return !success;
      });

    return sizes;
  }

  private applyAlignAndCoords(
    specsDimensions: TypeTileSpecsDimension[],
  ): TileSpecs[] {
    const { innerPadding, outerPadding } = this.specs;

    const start = this.isHorizontal ? 'left' : 'top';
    const startSize = this.stackSizeFor(start, specsDimensions);
    const startSpecs = this.specsFor(start, specsDimensions, outerPadding);

    const end = this.isHorizontal ? 'right' : 'bottom';
    const endSize = this.stackSizeFor(end, specsDimensions);
    const endAnchor = outerPadding + this.fixedFullSize - endSize;
    const endSpecs = this.specsFor(end, specsDimensions, 0, endAnchor);

    const centerSize = this.stackSizeFor('center', specsDimensions);
    const fullSize = this.stackFullSize + 2 * outerPadding;
    let centerAnchor = (fullSize - centerSize) / 2;

    const startEnd = outerPadding + startSize + innerPadding;
    const endStart = fullSize - outerPadding - endSize - innerPadding;
    const centerEnd = centerAnchor + centerSize;

    if (startEnd > centerAnchor) {
      centerAnchor = startEnd;
    } else if (centerEnd > endStart) {
      centerAnchor = endStart - centerSize;
    }

    const centerSpecs = this.specsFor(
      'center',
      specsDimensions,
      outerPadding,
      centerAnchor,
    );

    return [...startSpecs, ...endSpecs, ...centerSpecs]
      .sort((a, b) => (a.idx > b.idx ? 1 : -1))
      .map(({ specs }) => specs);
  }

  private specsFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
    outerPadding: number,
    anchor = 0,
  ) {
    const { absX, absY, innerPadding } = this.specs;

    let relX = (this.isHorizontal ? anchor : 0) + outerPadding;
    let relY = (this.isHorizontal ? 0 : anchor) + outerPadding;

    return this.propsFor(align).map(({ idx, props }) => {
      const dimensions = specsDimensions[idx];
      const stackSize = dimensions[this.stackDimension];

      if (stackSize === 0)
        return {
          idx,
          specs: new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
        };

      // align orthogonal to stack direction
      let offsetX = 0;
      let offsetY = 0;

      const fixedSize = dimensions[this.fixedDimension];
      const fixedDiff = this.fixedFullSize - fixedSize;

      if (fixedDiff > 0) {
        if (this.isHorizontal) {
          if (props.vAlign === 'center') offsetY = fixedDiff / 2;
          if (props.vAlign === 'bottom') offsetY = fixedDiff;
        } else {
          if (props.hAlign === 'center') offsetX = fixedDiff / 2;
          if (props.hAlign === 'right') offsetX = fixedDiff;
        }
      }

      const specs = new TileSpecs(
        dimensions.width,
        dimensions.height,
        absX + relX + offsetX,
        absY + relY + offsetY,
        relX + offsetX,
        relY + offsetY,
        props.innerPadding ?? 0,
        props.outerPadding ?? 0,
        props.hAlign || 'left',
        props.vAlign || 'top',
      );

      const step = innerPadding + stackSize;

      if (this.isHorizontal) {
        relX += step;
      } else {
        relY += step;
      }

      return { idx, specs };
    });
  }

  private stackSizeFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
  ) {
    const { innerPadding } = this.specs;

    let nProps = 0;

    let stackSize = this.propsFor(align).reduce((agg: number, { idx }) => {
      const dimensions = specsDimensions[idx];
      const size = dimensions[this.stackDimension];

      if (size > 0) nProps += 1;

      return agg + size;
    }, 0);

    stackSize += (nProps - 1) * innerPadding;

    return stackSize;
  }

  private propsFor(align: TypeTilePropsAlign) {
    return (this.groupedProps.get(align) || []) as TypeIndexedProps[];
  }

  private get groupedProps() {
    return this.props.reduce((agg, { idx, props }) => {
      const align = this.isHorizontal
        ? props.hAlign || 'left'
        : props.vAlign || 'top';

      return agg.set(align, [...(agg.get(align) || []), { idx, props }]);
    }, new Map());
  }

  private calculateFixedSize(
    fixedDimension: TilePropsDimensionsAccessor,
    fixedFullSize: number,
  ) {
    const fixedSize =
      fixedDimension.size ??
      fixedDimension.relSize(fixedFullSize) ??
      fixedFullSize;

    return Math.min(fixedSize, fixedFullSize);
  }

  private get sortedProps() {
    return [...this.props].sort((a, b) => {
      // reverse order w.r.t. unit ('px' > '%' > undefined)!
      const result = b.props.dim(this.stackDimension).compare(a.props);

      if (result === 0) return a.idx - b.idx; // small indexes first

      return result;
    });
  }

  private get nProps() {
    return this.props.length;
  }

  private get stackDimension(): 'width' | 'height' {
    if (this.stack === 'horizontal') return 'width';

    return 'height';
  }

  private get fixedDimension(): 'width' | 'height' {
    if (this.stack === 'horizontal') return 'height';

    return 'width';
  }

  private get isHorizontal(): boolean {
    return this.isStack && this.stack === 'horizontal';
  }

  private get isStack(): boolean {
    return this.stack !== 'none';
  }
}
