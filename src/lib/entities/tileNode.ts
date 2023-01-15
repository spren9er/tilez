import { get, writable, type Writable } from 'svelte/store';

import type {
  TypeTilePropsDimension,
  TypeTilePropsMode,
} from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';
import { TileSpecsCalculationFactory } from '$lib/factories/tileSpecsCalculationFactory';

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
    this.derivedProps = props.copy();
    this.parent = parent;
    this.specs = specs;
    this.children = [];

    // acts as store
    const store: Writable<TileNode> = writable(this);
    this.subscribe = store.subscribe;
    this.update = store.update;
    this.set = store.set;

    if (parent) {
      parent.addChild(this);
    } else {
      this.derivedProps.type = this.props.type || 'plain';
    }

    this.subscribe((node: TileNode) => node.updateChildrenSpecs());
  }

  public updateSpecs(
    width: TypeTilePropsDimension,
    height: TypeTilePropsDimension,
    innerPadding?: TypeTilePropsDimension,
    outerPadding?: TypeTilePropsDimension,
    mode?: TypeTilePropsMode,
  ) {
    this.update((node: TileNode) => {
      if (!node.specs) return node;

      const props = new TilePropsFactory({
        width,
        height,
        innerPadding,
        outerPadding,
        mode,
      }).build();

      if (props.dim('width').unit !== 'px' && props.dim('height').unit !== 'px')
        return node;

      // no change => update not necessary
      if (
        props.width === node.specs.width &&
        props.height === node.specs.height &&
        props.innerPadding === node.specs.innerPadding &&
        props.outerPadding === node.specs.outerPadding &&
        props.mode === node.derivedProps.mode
      )
        return node;

      node.derivedProps.innerPadding = props.innerPadding ?? 0;
      node.derivedProps.outerPadding = props.outerPadding ?? 0;
      node.derivedProps.mode = props.mode || 'spacing';
      this.updateDerivedProps();

      node.specs.width = props.width!;
      node.specs.height = props.height!;
      node.specs.innerPadding = props.innerPadding ?? 0;
      node.specs.outerPadding = props.outerPadding ?? 0;

      return node;
    });
  }

  public updateChildrenSpecs() {
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
    child.derivePropsFrom(this);

    this.update((node: TileNode) => {
      node.children = [...node.children, child];

      return node;
    });
  }

  private updateDerivedProps() {
    if (!this.hasChildren) return;

    this.children.forEach((child) => {
      child.derivePropsFrom(this);
      child.updateDerivedProps();
    });
  }

  private derivePropsFrom(parent: TileNode) {
    const parentNode = get(parent);

    // type
    this.derivedProps.type = this.deriveType();

    // inner padding
    if (!this.props.innerPadding && this.props.innerPadding !== 0)
      this.derivedProps.innerPadding = parentNode.derivedProps.innerPadding;

    // mode
    if (!this.props.mode) this.derivedProps.mode = parentNode.derivedProps.mode;
  }

  private deriveType() {
    const type = this.props.type;

    if (!type) return this.parentType!;

    const typeMapping = {
      plain: 'Plain',
      html: 'HTML',
      svg: 'SVG',
      canvas: 'Canvas',
    };

    if (this.parentType === 'svg') {
      if (['html', 'canvas'].includes(type))
        throw Error(
          `${typeMapping[type]} tile can't be embedded into SVG tile!`,
        );
    }

    if (this.parentType === 'canvas') {
      if (['html', 'svg'].includes(type))
        throw Error(
          `${typeMapping[type]} tile can't be embedded into Canvas tile!`,
        );
    }

    return type;
  }
}
