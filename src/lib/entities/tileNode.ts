import { writable, type Writable } from 'svelte/store';

import type { TypeTileProps } from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';
import { TileSpecsFactory } from '$lib/factories/tileSpecsFactory';
import { TileSpecsCalculationFactory } from '$lib/factories/tileSpecsCalculationFactory';

export type TypeTileNodeRootType = 'root' | 'subroot';

export class TileNode {
  public props: TileProps;
  public specs: TileSpecs;
  public parent?: TileNode;
  public children: TileNode[];
  public subscribe;
  public update;
  public set;

  constructor(props: TileProps, parent?: TileNode) {
    this.props = props;
    this.parent = parent;
    this.specs = new TileSpecsFactory(props, parent?.specs).build();
    this.children = [];

    // acts as store
    const store: Writable<TileNode> = writable(this);
    this.subscribe = store.subscribe;
    this.update = store.update;
    this.set = store.set;

    if (parent) parent.addChild(this);
  }

  public updateNodes(rawProps: TypeTileProps) {
    const props = new TilePropsFactory(rawProps).build();
    if (this.props.isEqualTo(props)) return;

    const startNode = this.selectStartNode(props);
    this.props = props;

    if (
      startNode === this ||
      (startNode.isSubRoot && startNode.specs.type === 'canvas')
    ) {
      startNode.update((node: TileNode) => {
        const specs = new TileSpecsFactory(
          node.props,
          node.parent?.specs,
        ).build();
        node.specs = node.specs.merge(specs);

        return node;
      });
    }

    startNode.updateSubSpecs();
  }

  private selectStartNode(props: TileProps) {
    const immutableProps = ['type', 'stack'];
    if (immutableProps.some((key) => !props.hasSameValue(this.props, key)))
      throw new Error('Can\'t modify immutable props "type" and "stack"');

    const startNode = this.specs.type === 'canvas' ? this.subRootNode : this;

    const parentProps = ['width', 'height', 'hAlign', 'vAlign'];

    if (
      !startNode.isRoot &&
      parentProps.some((key) => !props.hasSameValue(this.props, key))
    )
      return startNode.parent!;

    return startNode;
  }

  public get hasChildren() {
    return this.children.length > 0;
  }

  public get isRoot() {
    return !this.parent;
  }

  public get isSubRoot() {
    if (this.isRoot) return true;

    return this.specs.type !== this.parentType;
  }

  public get width() {
    return this.specs.width;
  }

  public get height() {
    return this.specs.height;
  }

  public get rootType(): TypeTileNodeRootType | undefined {
    if (this.isRoot) return 'root';
    if (this.isSubRoot) return 'subroot';
  }

  public get parentType() {
    if (this.isRoot) return;

    return this.parent!.specs.type;
  }

  public get subRootNode(): TileNode {
    if (this.isSubRoot) return this;

    let node = this.parent!;
    while (node && !node.isSubRoot) node = node.parent!;

    return node;
  }

  public get coords() {
    let offsetX = 0;
    let offsetY = 0;

    if (this.parent) {
      const needsOffset =
        this.rootType === 'subroot' && this.parent.specs.type === 'plain';

      if (needsOffset) {
        const { subRootX, subRootY } = this.parent.specs;

        // add coords of parent position within subtree (up to subroot)
        offsetX += subRootX;
        offsetY += subRootY;

        // add relative offset of subroot
        const subRoot = this.parent.subRootNode;
        offsetX += subRoot.specs.parentX || 0;
        offsetY += subRoot.specs.parentY || 0;
      }
    }

    return {
      x: (this.specs.parentX || 0) + offsetX,
      y: (this.specs.parentY || 0) + offsetY,
    };
  }

  public addChild(child: TileNode) {
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
    if (!this.hasChildren) return;

    const tileSpecsCalculation = new TileSpecsCalculationFactory(
      this.specs,
      this.children.map(({ props }) => props),
      this.isRoot,
    ).build();
    const specs = tileSpecsCalculation.call();

    this.children.forEach((child, idx) => {
      child.update((node: TileNode) => {
        node.specs = specs[idx];

        return node;
      });
    });
  }
}
