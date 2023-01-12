import { get, writable, type Writable } from 'svelte/store';

import type { TypeTilePropsDimension } from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TilePropsDimensionFactory } from '$lib/factories/tilePropsDimensionFactory';
import { TileSpecsCalculationFactory } from '$lib/factories/tileSpecsCalculationFactory';

export type TypeTileNodeRootType = 'root' | 'subroot';

export class TileNode {
  public props: TileProps;
  public specs?: TileSpecs;
  public parent?: TileNode;
  public children: TileNode[];
  public subscribe;
  public update;
  public set;

  constructor(props: TileProps, parent?: TileNode, specs?: TileSpecs) {
    this.props = props;
    this.parent = parent;
    this.specs = specs;
    this.children = [];

    // acts as store
    const store: Writable<TileNode> = writable(this);
    this.subscribe = store.subscribe;
    this.update = store.update;
    this.set = store.set;

    // node props have *always* non-trivial type
    if (parent) {
      parent.addChild(this);
    } else {
      this.props.type = this.props.type || 'plain';
    }

    this.subscribe((node: TileNode) => node.updateChildrenSpecs());
  }

  public updateSpecs(
    width: TypeTilePropsDimension,
    height: TypeTilePropsDimension,
  ) {
    this.update((node: TileNode) => {
      if (!node.specs) return node;

      const propsWidth = new TilePropsDimensionFactory('width', width).build();
      const propsHeight = new TilePropsDimensionFactory(
        'height',
        height,
      ).build();

      if (propsWidth.unit !== 'px' && propsHeight.unit !== 'px') return node;
      if (
        propsWidth.value === node.specs.width &&
        propsHeight.value === node.specs.height
      )
        return node;

      node.specs.width = propsWidth.value;
      node.specs.height = propsHeight.value;

      return node;
    });
  }

  public updateChildrenSpecs() {
    if (!this.hasChildren || !this.specs) return;

    const tileSpecsCalculation = new TileSpecsCalculationFactory(
      this.props.mode || 'spacing',
      this.specs,
      this.children.map(({ props }) => props),
      this.isRoot,
      this.props.type!,
      this.props.stack,
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

    return this.props.type !== this.parentType;
  }

  public get width() {
    return this.specs?.width;
  }

  public get height() {
    return this.specs?.height;
  }

  public get childrenProps() {
    return this.children.map((child) => get(child).props);
  }

  public addChild(child: TileNode) {
    child.derivePropsFrom(this);

    this.update((node: TileNode) => {
      node.children = [...node.children, child];

      return node;
    });
  }

  public get rootType(): TypeTileNodeRootType | undefined {
    if (this.isRoot) return 'root';
    if (this.isSubRoot) return 'subroot';
  }

  public get parentType() {
    if (this.isRoot) return;

    return this.parent!.props.type;
  }

  private derivePropsFrom(parent: TileNode) {
    const parentNode = get(parent);

    // type
    this.props.type = this.deriveType();

    // inner padding
    if (!this.props.innerPadding && this.props.innerPadding !== 0)
      this.props.innerPadding = parentNode.props.innerPadding;

    // mode
    if (!this.props.mode) this.props.mode = parentNode.props.mode;
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
