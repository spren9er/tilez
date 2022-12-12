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
        'Specs of tile are required for calculating specs of children nodes!',
      );

    this.props = node.childrenProps.map((props, idx) => ({ idx, props }));
    this.stack = node.props.stack;
    this.specs = node.specs;
  }

  public call(): TileSpecs[] {
    if (this.nProps === 0) return [];

    if (!this.isStack) return this.props.map(() => this.specs);

    const sizes = this.calculateSizes();
    const specs = this.addOffsets(sizes);
    return this.applyPadding(specs);
  }

  private calculateSizes() {
    const stackFullSize = this.specs[this.stackDimension];
    const fixedFullSize = this.specs[this.fixedDimension];

    let remainingSize = stackFullSize;
    let nPxPctSize = 0;
    let cumPxSize = 0;
    let cumPctSize = 0;

    const specsDimensions = this.sortedProps.map(({ idx, props }) => {
      const fixedDimension = props.dim(this.fixedDimension);
      const stackDimension = props.dim(this.stackDimension);

      let fixedSize: number | undefined;
      let stackSize: number | undefined;

      fixedSize =
        fixedDimension.size ??
        fixedDimension.relSize(fixedFullSize) ??
        fixedFullSize;
      fixedSize = Math.min(fixedSize, fixedFullSize);

      if (remainingSize > 0) {
        stackSize =
          stackDimension.size ??
          stackDimension.relSize(stackFullSize - cumPxSize) ??
          (stackFullSize - cumPxSize - cumPctSize) / (this.nProps - nPxPctSize);
        stackSize = Math.min(remainingSize, stackSize);

        remainingSize -= stackSize;

        const unit = stackDimension.unit;
        if (unit) nPxPctSize += 1;
        if (unit === 'px') cumPxSize += stackSize;
        if (unit === '%') cumPctSize += stackSize;
      }

      const specsDimension = {
        [this.stackDimension]: stackSize,
        [this.fixedDimension]: fixedSize,
      } as TypeTileSpecsDimension;

      return { idx, specsDimension };
    });

    return specsDimensions
      .sort((a, b) => (a.idx > b.idx ? 1 : -1))
      .map(({ specsDimension }) => specsDimension);
  }

  private addOffsets(sizes: TypeTileSpecsDimension[]) {
    let offset = 0;

    return sizes.map((specsDimension, idx) => {
      const props = this.props[idx].props;

      const specs: TypeTileSpecs = {
        ...specsDimension,
        ...this.offsetsFor(specsDimension, offset, props.align),
      };

      offset += specsDimension[this.stackDimension];

      return specs;
    });
  }

  private offsetsFor(
    specsDimension: TypeTileSpecsDimension,
    offset: number,
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

  private applyPadding(specs: TypeTileSpecs[]) {
    return specs.map((specs, idx) => {
      const props = this.props[idx].props;
      if (props.stack === 'none')
        specs = this.paddingFor(specs, props.padding ?? 0);

      const { width, height, absX, absY, relX, relY } = specs;

      const tileSpecs = new TileSpecs(width, height, absX, absY, relX, relY);

      return tileSpecs;
    });
  }

  private paddingFor(specs: TypeTileSpecs, padding: number) {
    const width = Math.max(specs.width - 2 * padding, 0);
    const height = Math.max(specs.height - 2 * padding, 0);

    return {
      width,
      height,
      absX: specs.absX + padding,
      absY: specs.absY + padding,
      relX: specs.relX + padding,
      relY: specs.relY + padding,
    };
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
