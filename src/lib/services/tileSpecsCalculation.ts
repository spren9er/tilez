import type { TypeTilePropsStack } from '$lib/types/tileProps.type';
import type {
  TypeTileSpecs,
  TypeTileSpecsDimension,
  TypeTileSpecsCoords,
} from '$lib/types/tileSpecs.type';
import type { TileNode } from '$lib/entities/tileNode';
import type {
  TileProps,
  TilePropsDimensionsAccessor,
} from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/entities/tileSpecs';

export class TileSpecsCalculation {
  private props: { idx: number; props: TileProps }[];
  private stack?: TypeTilePropsStack;
  private specs: TileSpecs;

  private stackFullSize: number;
  private fixedFullSize: number;
  private fullSize: number;
  private pctFullSize: number;

  constructor(node: TileNode) {
    if (!node.specs)
      throw new Error(
        'Specs of tile are required for calculating specs of children nodes!',
      );

    this.props = node.childrenProps.map((props, idx) => ({ idx, props }));
    this.stack = node.props.stack;
    this.specs = node.specs;

    const { outerPadding } = this.specs;

    this.stackFullSize = Math.max(
      this.specs[this.stackDimension] - 2 * outerPadding,
      0,
    );
    this.fixedFullSize = Math.max(
      this.specs[this.fixedDimension] - 2 * outerPadding,
      0,
    );

    this.fullSize = 0;
    this.pctFullSize = this.stackFullSize;
  }

  public call(): TileSpecs[] {
    if (this.nProps === 0) return [];

    if (!this.isStack) return this.props.map(() => this.specs);

    if (this.stackFullSize <= 0)
      return Array(this.nProps).fill(
        new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      );

    const specsDimensions = this.calculateSizes();
    const specsCoords = this.applyCoords(specsDimensions);
    const specs = this.applyAlign(specsCoords);

    return specs.map((_specs) => {
      const {
        width,
        height,
        absX,
        absY,
        relX,
        relY,
        innerPadding,
        outerPadding,
        hAlign,
        vAlign,
      } = _specs;

      return new TileSpecs(
        width,
        height,
        absX,
        absY,
        relX,
        relY,
        innerPadding,
        outerPadding,
        hAlign,
        vAlign,
      );
    });
  }

  private calculateSizes(): TypeTileSpecsDimension[] {
    const { innerPadding } = this.specs;

    const sizes = [...this.calculatePxSizes(), ...this.calculatePctSizes()];

    const fullSize = sizes.reduce((agg, size) => agg + size, 0);
    const nTiles = sizes.filter((size) => size !== 0).length;
    this.fullSize = fullSize + (nTiles - 1) * innerPadding;

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

    let firstTile = true;

    return pxProps.map(({ props }) => {
      if (this.pctFullSize <= innerPadding) return 0;

      const stackDimension = props.dim(this.stackDimension);
      const stackSize = Math.min(stackDimension.size!, this.pctFullSize);

      const step = firstTile ? stackSize : innerPadding + stackSize;

      if (stackSize > 0) {
        this.pctFullSize -= step;
        firstTile = false;
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

    if (this.pctFullSize <= innerPadding) return new Array(maxPctSpecs).fill(0);

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
          if (availableSize < 1) {
            if (idx >= n) {
              sizes.push(0);
              return true;
            } else {
              success = false;
              return false;
            }
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

            if (stackSize < 1) {
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

  private applyCoords(
    specsDimensions: TypeTileSpecsDimension[],
  ): (TypeTileSpecsDimension & TypeTileSpecsCoords)[] {
    const { innerPadding, outerPadding, absX, absY } = this.specs;

    let relX = outerPadding;
    let relY = outerPadding;

    return specsDimensions.map((specsDimension) => {
      const specCoords = {
        ...specsDimension,
        relX,
        relY,
        absX: absX + relX,
        absY: absY + relY,
      };

      const stackSize = specsDimension[this.stackDimension];
      if (stackSize <= 0) return specCoords;

      const step = stackSize + innerPadding;

      if (this.isHorizontal) {
        relX += step;
      } else {
        relY += step;
      }

      return specCoords;
    });
  }

  private applyAlign(
    specsCoords: (TypeTileSpecsDimension & TypeTileSpecsCoords)[],
  ): TypeTileSpecs[] {
    const stackDiff = this.stackFullSize - this.fullSize;
    let stackOffset = 0;

    if (this.isHorizontal) {
      if (this.specs.hAlign === 'center') stackOffset = stackDiff / 2;
      if (this.specs.hAlign === 'right') stackOffset = stackDiff;
    } else {
      if (this.specs.vAlign === 'center') stackOffset = stackDiff / 2;
      if (this.specs.vAlign === 'bottom') stackOffset = stackDiff;
    }

    return specsCoords.map((coords, idx) => {
      const fixedDiff = this.fixedFullSize - coords[this.fixedDimension];
      let fixedOffset = 0;

      if (this.isHorizontal) {
        if (this.specs.vAlign === 'center') fixedOffset = fixedDiff / 2;
        if (this.specs.vAlign === 'bottom') fixedOffset = fixedDiff;

        coords.absX += stackOffset;
        coords.relX += stackOffset;
        coords.absY += fixedOffset;
        coords.relY += fixedOffset;
      } else {
        if (this.specs.hAlign === 'center') fixedOffset = fixedDiff / 2;
        if (this.specs.hAlign === 'right') fixedOffset = fixedDiff;

        coords.absX += fixedOffset;
        coords.relX += fixedOffset;
        coords.absY += stackOffset;
        coords.relY += stackOffset;
      }

      const { innerPadding, outerPadding, hAlign, vAlign } =
        this.props[idx].props;

      return {
        ...coords,
        innerPadding: innerPadding ?? 0,
        outerPadding: outerPadding ?? 0,
        hAlign: hAlign || 'left',
        vAlign: vAlign || 'top',
      };
    });
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
