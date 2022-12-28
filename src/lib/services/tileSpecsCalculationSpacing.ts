import type { TypeTilePropsAlign } from '$lib/types/tileProps.type';
import type { TypeTileSpecsDimension } from '$lib/types/tileSpecs.type';
import type { TilePropsDimensionsAccessor } from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileSpecsCalculation } from './tileSpecsCalculation';

export class TileSpecsCalculationSpacing extends TileSpecsCalculation {
  protected calculatePxSizes(): number[] {
    const { innerPadding } = this.specs;

    if (!this.root) {
      this.pctFullSize += innerPadding;
      this.stackFullSize += innerPadding;
      this.fixedFullSize += innerPadding;
    }

    const pxProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit === 'px';
    });

    return pxProps.map(({ props }) => {
      const stackDimension = props.dim(this.stackDimension);
      const size = Math.min(stackDimension.size!, this.pctFullSize);
      const stackSize = size - innerPadding;

      if (stackSize < 1) return 0;

      this.pctFullSize -= size;

      return stackSize;
    });
  }

  protected calculatePctSizes(): number[] {
    const { innerPadding } = this.specs;

    const pctProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit !== 'px';
    });
    const maxPctSpecs = pctProps.length;

    if (this.pctFullSize < innerPadding + 1)
      return new Array(maxPctSpecs).fill(0);

    let sizes: number[] = [];
    Array.from(Array(maxPctSpecs + 1).keys())
      .reverse()
      .every((n) => {
        sizes = [];

        let pctSize = 0;

        let nPctTiles = 0;
        let success = true;

        pctProps.every(({ props }, idx) => {
          if (idx >= n) {
            sizes.push(0);
            return true;
          }

          const stackDimension = props.dim(this.stackDimension);
          const { unit } = stackDimension;

          const nFlexTiles = n - nPctTiles;

          let size =
            stackDimension.relSize(this.pctFullSize) ??
            (this.pctFullSize - pctSize) / nFlexTiles;

          if (unit === '%') {
            nPctTiles += 1;
            size = Math.min(size, this.pctFullSize - pctSize);
            pctSize += size;
          }

          const stackSize = size - innerPadding;

          if (stackSize < 1) {
            success = false;
            return false;
          }

          sizes.push(stackSize);

          return true;
        });

        return !success;
      });

    return sizes;
  }

  protected calculateFixedSize(
    fixedDimension: TilePropsDimensionsAccessor,
    fixedFullSize: number,
  ): number {
    const { innerPadding } = this.specs;

    return (
      super.calculateFixedSize(fixedDimension, fixedFullSize) - innerPadding
    );
  }

  protected specsFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
    anchor: number,
  ) {
    const { absX, absY, innerPadding, outerPadding } = this.specs;

    let relX = this.isHorizontal ? anchor : outerPadding;
    let relY = this.isHorizontal ? outerPadding : anchor;

    if (!this.root) {
      relX -= innerPadding / 2;
      relY -= innerPadding / 2;
    }

    return this.propsFor(align).map(({ idx, props }) => {
      const dimensions = specsDimensions[idx];
      const stackSize = dimensions[this.stackDimension];

      if (stackSize === 0)
        return {
          idx,
          specs: new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
        };

      // align orthogonal to stack direction
      let offsetY = 0;
      let offsetX = 0;

      if (this.isHorizontal) {
        relX += innerPadding / 2;
        offsetY = innerPadding / 2;
      } else {
        relY += innerPadding / 2;
        offsetX = innerPadding / 2;
      }

      const fixedSize = dimensions[this.fixedDimension];
      const fixedDiff = this.fixedFullSize - fixedSize - innerPadding;

      if (fixedDiff > 0) {
        if (this.isHorizontal) {
          if (props.vAlign === 'center') offsetY += fixedDiff / 2;
          if (props.vAlign === 'bottom') offsetY += fixedDiff;
        } else {
          if (props.hAlign === 'center') offsetX += fixedDiff / 2;
          if (props.hAlign === 'right') offsetX += fixedDiff;
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

      if (this.isHorizontal) {
        relX += innerPadding / 2 + stackSize;
      } else {
        relY += innerPadding / 2 + stackSize;
      }

      return { idx, specs };
    });
  }

  protected stackSizeFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
  ) {
    const { innerPadding } = this.specs;

    return this.propsFor(align).reduce((agg: number, { idx }) => {
      const dimensions = specsDimensions[idx];
      const size = dimensions[this.stackDimension];

      if (size === 0) return agg;

      return agg + size + innerPadding;
    }, 0);
  }
}
