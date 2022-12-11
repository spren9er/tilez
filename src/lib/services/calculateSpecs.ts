import type {
  TypeTilePropsStack,
  TypeTilePropsAlign,
} from '$lib/types/tileProps.type';
import type {
  TypeTileSpecs,
  TypeTileSpecsDimension,
  TypeTileSpecsCoords,
} from '$lib/types/tileSpecs.type';
import type { TileNode } from '$lib/entities/tileNode';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/valueObjects/tileSpecs';

export class CalculateSpecs {
  private props: { idx: number; props: TileProps }[];
  private stack?: TypeTilePropsStack;
  private specs: TileSpecs;

  constructor(node: TileNode) {
    if (!node.specs)
      throw new Error(
        'Specs of root node are required for calculating specs of children nodes!',
      );

    this.props = node.childrenProps.map((props, idx) => ({ idx, props }));
    this.stack = node.props.stack;
    this.specs = node.specs;
  }

  public call(): TileSpecs[] {
    const nProps = this.props.length;

    if (nProps === 0) return [];

    if (!this.isStack) return this.props.map(() => this.specs);

    const stackFullSize = this.specs[this.stackDimension];
    const fixedFullSize = this.specs[this.fixedDimension];

    let remainingSize = stackFullSize;
    let cumPxSize = 0;
    let cumPctSize = 0;
    let nPxPctSize = 0;

    const specsDimensions = this.sortedProps.map(({ idx, props }) => {
      const otherUnit = props.unitFor(this.fixedDimension);
      const otherValue = props[this.fixedDimension]!;

      let otherSize = fixedFullSize;
      if (otherUnit === 'px') otherSize = otherValue ?? fixedFullSize;
      if (otherUnit === '%') otherSize = otherValue * fixedFullSize;
      otherSize = Math.min(otherSize, fixedFullSize);

      let size = 0;
      if (remainingSize > 0) {
        const unit = props.unitFor(this.stackDimension);

        if (unit === 'px') {
          size = props[this.stackDimension]!;
          nPxPctSize += 1;
        } else if (unit === '%') {
          size = props[this.stackDimension]! * (stackFullSize - cumPxSize);
          nPxPctSize += 1;
        } else {
          size =
            (stackFullSize - cumPxSize - cumPctSize) / (nProps - nPxPctSize);
        }

        size = Math.min(remainingSize, size);

        remainingSize -= size;
        if (unit === 'px') cumPxSize += size;
        if (unit === '%') cumPctSize += size;
      }

      const specsDimension = {
        [this.stackDimension]: size,
        [this.fixedDimension]: otherSize,
      } as TypeTileSpecsDimension;

      return { idx, specsDimension };
    });

    let offset = 0;

    return specsDimensions
      .sort((a, b) => (a.idx > b.idx ? 1 : -1))
      .map(({ specsDimension }, idx) => {
        const props = this.props[idx].props;
        const align = props.align || 'center';

        const specs: TypeTileSpecs = {
          ...specsDimension,
          ...this.offsets(offset, specsDimension, align),
        };

        offset += specsDimension[this.stackDimension];

        return specs;
      })
      .map((specs, idx) => {
        const props = this.props[idx].props;
        if (!props.stack) specs = this.applyPadding(specs, props.padding ?? 0);

        const { width, height, absX, absY, relX, relY } = specs;

        const tileSpecs = new TileSpecs(width, height, absX, absY, relX, relY);

        return tileSpecs;
      });
  }

  private offsets(
    offset: number,
    specsDimension: TypeTileSpecsDimension,
    align: TypeTilePropsAlign,
  ): TypeTileSpecsCoords {
    let hAlignOffset = 0;
    let vAlignOffset = 0;

    const { width, height, absX, absY } = this.specs;

    // nudge offsets if tile should be aligned
    if (this.isHorizontal) {
      if (specsDimension.height < height) {
        const diff = height - specsDimension.height;

        if (align === 'center') {
          vAlignOffset = diff / 2;
        } else if (align === 'bottom') {
          vAlignOffset = diff;
        }
      }
    } else {
      if (specsDimension.width < width) {
        const diff = width - specsDimension.width;

        if (align === 'center') {
          hAlignOffset = diff / 2;
        } else if (align === 'right') {
          hAlignOffset = diff;
        }
      }
    }

    return {
      absX: this.isHorizontal ? absX + offset : absX + hAlignOffset,
      absY: this.isHorizontal ? absY + vAlignOffset : absY + offset,
      relX: this.isHorizontal ? offset : hAlignOffset,
      relY: this.isHorizontal ? vAlignOffset : offset,
    };
  }

  private applyPadding(specs: TypeTileSpecs, padding: number) {
    return {
      width: specs.width - 2 * padding,
      height: specs.height - 2 * padding,
      absX: specs.absX + padding,
      absY: specs.absY + padding,
      relX: specs.relX + padding,
      relY: specs.relY + padding,
    };
  }

  private get sortedProps() {
    return [...this.props].sort((a, b) => {
      // reverse order ('highest' units first)!
      const result = b.props.compare(a.props, this.stackDimension);

      if (result === 0) return a.idx - b.idx; // small indexes first

      return result;
    });
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
    return !!this.stack;
  }
}
