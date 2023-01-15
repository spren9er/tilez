import { get, writable, type Writable } from 'svelte/store';

import type {
  TypeTilePropsDimension,
  TypeTilePropsMode,
} from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';
import { TileSpecsCalculationFactory } from '$lib/factories/tileSpecsCalculationFactory';
import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

export type TypeTileNodeRootType = 'root' | 'subroot';

export class TileNode {
  public props: TileProps;
  public derivedProps: TileProps;
  public specs?: TileSpecs;
  public parent?: TileNode;
  public children: TileNode[];
  public subscribe;
  public update;
  public set;

  constructor(props: TileProps, parent?: TileNode, specs?: TileSpecs) {
    this.props = props;
    this.derivedProps = this.deriveProps(props, parent);
    this.parent = parent;
    this.specs = specs;
    this.children = [];

    // acts as store
    const store: Writable<TileNode> = writable(this);
    this.subscribe = store.subscribe;
    this.update = store.update;
    this.set = store.set;

    if (parent) parent.addChild(this);
  }

  public updateNodes(
    width: TypeTilePropsDimension,
    height: TypeTilePropsDimension,
    innerPadding?: TypeTilePropsDimension,
    outerPadding?: TypeTilePropsDimension,
    mode?: TypeTilePropsMode,
  ) {
    if (!this.specs) return;

    const props = new TilePropsFactory({
      width,
      height,
      innerPadding,
      outerPadding,
      mode,
    }).build();

    const derivedProps = this.deriveProps(props, this.parent);

    if (this.isRoot) {
      if (
        derivedProps.dim('width').unit !== 'px' &&
        derivedProps.dim('height').unit !== 'px'
      )
        return;

      this.update((node: TileNode) => {
        if (node.specs) {
          node.specs.width = derivedProps.width!;
          node.specs.height = derivedProps.height!;
          node.specs.innerPadding = derivedProps.innerPadding ?? 0;
          node.specs.outerPadding = derivedProps.outerPadding ?? 0;
        }

        return node;
      });
    }

    this.derivedProps.dimensions = new TilePropsDimensionsFactory(
      derivedProps.width,
      derivedProps.height,
    ).build();
    this.derivedProps.innerPadding = derivedProps.innerPadding;
    this.derivedProps.outerPadding = derivedProps.outerPadding;
    this.derivedProps.mode = derivedProps.mode;
    this.updateSubDerivedProps();

    (this.isRoot ? this : this.parent!).updateSubSpecs();
  }

  public get hasChildren() {
    return this.children.length > 0;
  }

  public get isRoot() {
    return !this.parent;
  }

  public get isSubRoot() {
    if (this.isRoot) return true;

    return this.derivedProps.type !== this.parentType;
  }

  public get width() {
    return this.specs?.width;
  }

  public get height() {
    return this.specs?.height;
  }

  public get rootType(): TypeTileNodeRootType | undefined {
    if (this.isRoot) return 'root';
    if (this.isSubRoot) return 'subroot';
  }

  public get parentType() {
    if (this.isRoot) return;

    return this.parent!.derivedProps.type;
  }

  public get coords() {
    let offsetX = 0;
    let offsetY = 0;

    if (this.parent) {
      const needsOffset =
        this.rootType === 'subroot' &&
        this.parent.derivedProps.type === 'plain';

      if (needsOffset) {
        const { subRootX, subRootY } = this.parent.specs!;

        // add coords of parent position within subtree (up to subroot)
        offsetX += subRootX;
        offsetY += subRootY;

        // add relative offset of subroot
        let parent = this.parent;
        while (
          parent.parent &&
          parent.parent.derivedProps.type === parent.derivedProps.type
        ) {
          parent = parent.parent;
        }

        offsetX += parent?.specs?.parentX || 0;
        offsetY += parent?.specs?.parentY || 0;
      }
    }

    return {
      x: (this.specs?.parentX || 0) + offsetX,
      y: (this.specs?.parentY || 0) + offsetY,
    };
  }

  public addChild(child: TileNode) {
    child.updateDerivedProps(this);

    this.children = [...this.children, child];

    this.updateSubSpecs();
  }

  private updateSubSpecs() {
    if (!this.hasChildren) return;

    this.updateChildrenSpecs();

    this.children.forEach((child) => {
      child.updateSubSpecs();
    });
  }

  private updateChildrenSpecs() {
    if (!this.hasChildren || !this.specs) return;

    const tileSpecsCalculation = new TileSpecsCalculationFactory(
      this.derivedProps.mode || 'spacing',
      this.specs,
      this.children.map(({ derivedProps }) => derivedProps),
      this.isRoot,
      this.derivedProps.type!,
      this.derivedProps.stack,
    ).build();
    const specs = tileSpecsCalculation.call();

    this.children.forEach((child, idx) => {
      child.update((node: TileNode) => {
        node.specs = specs[idx];

        return node;
      });
    });
  }

  private updateSubDerivedProps() {
    if (!this.hasChildren) return;

    this.children.forEach((child) => {
      child.updateDerivedProps(this);
      child.updateSubDerivedProps();
    });
  }

  private updateDerivedProps(parent: TileNode) {
    this.derivedProps = this.deriveProps(this.props, parent);
  }

  private deriveProps(props: TileProps, parent?: TileNode) {
    const derivedProps = props.copy();

    // type
    derivedProps.type = this.deriveType(props, parent);

    if (!parent) return derivedProps;

    // inner padding
    if (!this.props.innerPadding && this.props.innerPadding !== 0)
      derivedProps.innerPadding = parent.derivedProps.innerPadding;

    // mode
    if (!this.props.mode) derivedProps.mode = parent.derivedProps.mode;

    return derivedProps;
  }

  private deriveType(props: TileProps, parent?: TileNode) {
    const type = this.props.type;

    if (!parent) return props.type || 'plain';

    const parentType = parent.derivedProps.type;

    if (!type) return parentType!;

    const typeMapping = {
      plain: 'Plain',
      html: 'HTML',
      svg: 'SVG',
      canvas: 'Canvas',
    };

    if (parentType === 'svg') {
      if (['html', 'canvas'].includes(type))
        throw Error(
          `${typeMapping[type]} tile can't be embedded into SVG tile!`,
        );
    }

    if (parentType === 'canvas') {
      if (['html', 'svg'].includes(type))
        throw Error(
          `${typeMapping[type]} tile can't be embedded into Canvas tile!`,
        );
    }

    return type;
  }
}
