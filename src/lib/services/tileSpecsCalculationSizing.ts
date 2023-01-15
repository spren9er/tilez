import type {
  TypeTilePropsStack,
  TypeTilePropsAlign,
  TypeTilePropsType,
} from '$lib/types/tileProps.type';
import type { TypeTileSpecsDimension } from '$lib/types/tileSpecs.type';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileSpecsCalculation } from './tileSpecsCalculation';

export class TileSpecsCalculationSizing extends TileSpecsCalculation {
  private firstTile: boolean;

  constructor(
    specs: TileSpecs,
    props: TileProps[],
    root: boolean,
    type: TypeTilePropsType,
    stack?: TypeTilePropsStack,
  ) {
    super(specs, props, root, type, stack);

    this.firstTile = true;
  }

  protected calculateAbsSizes(): number[] {
    const { innerPadding } = this.specs;

    const absProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit === 'px';
    });

    return absProps.map(({ props }) => {
      const minSize = this.firstTile ? 1 : 1 + innerPadding;
      if (this.fullSize < minSize) return 0;

      const stackDimension = props.dim(this.stackDimension);
      const stackSize = Math.min(
        stackDimension.size!,
        this.firstTile ? this.fullSize : this.fullSize - innerPadding,
      );

      const step = this.firstTile ? stackSize : innerPadding + stackSize;
      this.fullSize -= step;
      this.firstTile = false;

      return stackSize;
    });
  }

  protected calculateNonAbsSizes(): number[] {
    const { innerPadding } = this.specs;

    const nonAbsProps = this.sortedProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit !== 'px';
    });
    const nNonAbsProps = nonAbsProps.length;

    // there are already some tiles with absolute size (add single inner padding at the end)
    if (!this.firstTile) this.fullSize -= innerPadding;

    if (this.fullSize < 1) return new Array(nNonAbsProps).fill(0);

    const relProps = nonAbsProps.filter(({ props }) => {
      return props.dim(this.stackDimension).unit === '%';
    });

    const flexProps = nonAbsProps.filter(({ props }) => {
      return !props.dim(this.stackDimension).unit;
    });
    const nFlexProps = flexProps.length;

    const nonAbsSize = this.fullSize;
    let n = nNonAbsProps;
    while (n > 0) {
      const padding = (n - 1) * innerPadding;
      const fullSize = nonAbsSize - padding;

      if (fullSize < n) {
        n--;
        continue;
      }

      this.fullSize = fullSize;
      const relSizes = this.calculateRelSizes(relProps, fullSize);

      const nNonZeroRelSizes = relSizes.filter((size) => size > 0).length;
      const nFlexSizes = n - nNonZeroRelSizes;

      if (nFlexSizes === 0)
        return [...relSizes, ...new Array(nFlexProps).fill(0)];

      if (nFlexSizes > 0 && nFlexSizes <= nFlexProps) {
        const stackSize = this.fullSize / nFlexSizes;

        if (stackSize >= 1)
          return [
            ...relSizes,
            ...new Array(nFlexSizes).fill(stackSize),
            ...new Array(nFlexProps - nFlexSizes).fill(0),
          ];
      }

      n--;
    }

    return new Array(nNonAbsProps).fill(0);
  }

  protected applyAlignAndCoords(
    specsDimensions: TypeTileSpecsDimension[],
  ): TileSpecs[] {
    const { innerPadding } = this.specs;

    return super.applyAlignAndCoords(specsDimensions, innerPadding);
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

    return this.propsFor(align).map(({ idx, props }) => {
      const dimensions = specsDimensions[idx];
      const stackSize = dimensions[this.stackDimension];

      if (stackSize === 0)
        return {
          idx,
          specs: new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
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

      const step = innerPadding + stackSize;

      if (this.isHorizontal) {
        parentX += step;
      } else {
        parentY += step;
      }

      return { idx, specs };
    });
  }

  protected stackSizeFor(
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
}
