import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileNode } from '$lib/entities/tileNode';
import { TileSpecs } from '$lib/entities/tileSpecs';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

export class TileNodeFactory {
  private props: TileProps;
  private parent?: TileNode;
  private specs?: TileSpecs;

  constructor(rawProps: TypeTileProps, parent?: TileNode) {
    this.props = new TilePropsFactory(rawProps).build();
    this.parent = parent;

    if (!this.parent) this.specs = this.rootSpecs();
  }

  public build() {
    return new TileNode(this.props, this.parent, this.specs);
  }

  private rootSpecs() {
    const units = ['width', 'height'].map(
      (dim) => this.props.dim(dim as 'width' | 'height').unit,
    );
    if (units.includes('%'))
      throw new Error("Root tile can't handle relative dimensions!");

    const { width, height, innerPadding, outerPadding, hAlign, vAlign } =
      this.props;

    return new TileSpecs(
      width ?? 0,
      height ?? 0,
      0,
      0,
      0,
      0,
      innerPadding ?? 0,
      outerPadding ?? 0,
      hAlign || 'left',
      vAlign || 'top',
    );
  }
}
