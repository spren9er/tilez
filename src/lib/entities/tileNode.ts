import { get, writable, type Writable } from 'svelte/store';

import type { TypeTilePropsDimension } from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TilePropsDimensionFactory } from '$lib/factories/tilePropsDimensionFactory';
import { TileSpecsCalculation } from '$lib/services/tileSpecsCalculation';

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

    this.subscribe((node: TileNode) => node.updateChildrenSpecs());

    if (parent) parent.addChild(this);
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

      node.specs.width = propsWidth.value;
      node.specs.height = propsHeight.value;

      return node;
    });
  }

  public updateChildrenSpecs() {
    if (!this.hasChildren || !this.specs) return;

    const specs = new TileSpecsCalculation(
      this.props.stack,
      this.specs,
      this.children.map(({ props }) => props),
    ).call();

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

  private derivePropsFrom(parent: TileNode) {
    const parentNode = get(parent);

    const parentType = parentNode.props.type;
    const type = this.props.type;
    if (type && type !== 'svg' && parentType === 'svg')
      throw Error("SVG tile can't be embedded into a non-SVG tile!");
    if (!type) this.props.type = parentType;

    if (!this.props.innerPadding && this.props.innerPadding !== 0)
      this.props.innerPadding = parentNode.props.innerPadding;

    if (
      !this.props.vAlign &&
      parentNode.props.vAlign &&
      parentNode.props.stack === 'horizontal'
    )
      this.props.vAlign = parentNode.props.vAlign;

    if (
      !this.props.hAlign &&
      parentNode.props.hAlign &&
      parentNode.props.stack === 'vertical'
    )
      this.props.hAlign = parentNode.props.hAlign;
  }
}
