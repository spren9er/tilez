import type { TypeTilePropsAlign } from '$lib/types/tileProps.type';
import type { TypeTileSpecsDimension } from '$lib/types/tileSpecs.type';
import type { TilePropsDimensionsAccessor } from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileSpecsCalculation } from './tileSpecsCalculation';

export class TileSpecsCalculationSpacing extends TileSpecsCalculation {
  protected calculateAbsSizes(): number[] {
    const { innerPadding } = this.specs;

    // extend available sizes by "inner padding / 2" on each side if inner tile
    if (!this.root) {
      this.fullSize += innerPadding;
      this.stackFullSize += innerPadding;
      this.fixedFullSize += innerPadding;
    }

    const absProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit === 'px';
    });

    return absProps.map(({ props }) => {
      const stackDimension = props.dim(this.stackDimension);
      const step = Math.min(stackDimension.size!, this.fullSize);
      const stackSize = step - innerPadding;

      if (stackSize < 1) return 0;

      this.fullSize -= step;

      return stackSize;
    });
  }

  protected calculateNonAbsSizes(): number[] {
    const { innerPadding } = this.specs;

    const nonAbsProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit !== 'px';
    });
    const nNonAbsProps = nonAbsProps.length;

    if (this.fullSize < innerPadding + 1)
      return new Array(nNonAbsProps).fill(0);

    const relProps = nonAbsProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit === '%';
    });

    const relSizes = this.calculateRelSizes(
      relProps,
      this.fullSize,
      innerPadding,
    );

    const flexProps = nonAbsProps.filter(({ props }) => {
      return !props.dim(this.stackDimension).unit;
    });
    const nFlexProps = flexProps.length;

    if (this.fullSize < innerPadding + 1)
      return [...relSizes, ...new Array(nFlexProps).fill(0)];

    let n = nFlexProps;
    let stackSize = 0;

    while (n > 0) {
      const size = (this.fullSize - n * innerPadding) / n;

      if (size >= 1) {
        stackSize = size;
        break;
      }

      n--;
    }

    return [
      ...relSizes,
      ...new Array(n).fill(stackSize),
      ...new Array(nFlexProps - n).fill(0),
    ];
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
    const { rootX, rootY, subRootX, subRootY, innerPadding, outerPadding } =
      this.specs;

    let parentX = this.isHorizontal ? anchor : outerPadding;
    let parentY = this.isHorizontal ? outerPadding : anchor;

    if (!this.root) {
      parentX -= innerPadding / 2;
      parentY -= innerPadding / 2;
    }

    return this.propsFor(align).map(({ idx, props }) => {
      const dimensions = specsDimensions[idx];
      const stackSize = dimensions[this.stackDimension];

      if (stackSize === 0)
        return {
          idx,
          specs: new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
        };

      // align orthogonal to stack direction
      let offsetY = 0;
      let offsetX = 0;

      if (this.isHorizontal) {
        parentX += innerPadding / 2;
        offsetY = innerPadding / 2;
      } else {
        parentY += innerPadding / 2;
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
        dimensions.width > 0 ? dimensions.width : 0,
        dimensions.height > 0 ? dimensions.height : 0,
        rootX + parentX + offsetX,
        rootY + parentY + offsetY,
        this.isSubRoot(props) ? 0 : subRootX + parentX + offsetX,
        this.isSubRoot(props) ? 0 : subRootY + parentY + offsetY,
        parentX + offsetX,
        parentY + offsetY,
        props.innerPadding ?? 0,
        props.outerPadding ?? 0,
        props.hAlign || 'left',
        props.vAlign || 'top',
      );

      if (this.isHorizontal) {
        parentX += innerPadding / 2 + stackSize;
      } else {
        parentY += innerPadding / 2 + stackSize;
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
