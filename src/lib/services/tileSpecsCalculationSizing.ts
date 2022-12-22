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
import { TileSpecsCalculation } from './tileSpecsCalculation';

export class TileSpecsCalculationSizing extends TileSpecsCalculation {
  private firstTile: boolean;

  constructor(
    specs: TileSpecs,
    props: TileProps[],
    root: boolean,
    stack?: TypeTilePropsStack,
  ) {
    super(specs, props, root, stack);

    this.firstTile = true;
  }

  protected calculatePxSizes(): number[] {
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

  protected calculatePctSizes(): number[] {
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
        let pctSize = fullSize;
        let flexFullSize = pctSize;

        let nPctTiles = 0;
        let success = true;

        pctProps.every(({ props }, idx) => {
          if (idx >= n) {
            sizes.push(0);
            return true;
          }

          if (pctSize < 1) {
            success = false;
            return false;
          }

          const stackDimension = props.dim(this.stackDimension);

          let stackSize: number;
          if (stackDimension.unit === '%') {
            stackSize = stackDimension.relSize(fullSize)!;
            stackSize = Math.min(stackSize, pctSize);
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

          pctSize -= stackSize;
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
  ) {
    const fixedSize =
      fixedDimension.size ??
      fixedDimension.relSize(fixedFullSize) ??
      fixedFullSize;

    return Math.min(fixedSize, fixedFullSize);
  }

  protected applyAlignAndCoords(
    specsDimensions: TypeTileSpecsDimension[],
  ): TileSpecs[] {
    const { innerPadding, outerPadding } = this.specs;

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

    const startEnd = outerPadding + startSize + innerPadding;
    const endStart = fullSize - outerPadding - endSize - innerPadding;
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

  protected specsFor(
    align: TypeTilePropsAlign,
    specsDimensions: TypeTileSpecsDimension[],
    anchor: number,
  ) {
    const { absX, absY, innerPadding, outerPadding } = this.specs;

    let relX = this.isHorizontal ? anchor : outerPadding;
    let relY = this.isHorizontal ? outerPadding : anchor;

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
