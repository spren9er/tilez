import { getContext, hasContext, setContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

import type {
  TypeTileProps,
  TypeTilePropsDimension,
} from '$lib/types/tileProps.type';
import type { TileNode } from '$lib/entities/tileNode';

import { TileSpecs } from '$lib/valueObjects/tileSpecs';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TilePropsDimensionFactory } from '$lib/factories/tilePropsDimensionFactory';

export function registerTile(props: TypeTileProps) {
  let parentNodeStore: Writable<TileNode> | undefined;
  let parentNode: TileNode | undefined;
  let specs: TileSpecs | undefined;

  const root = !hasContext('tilez-internal');

  if (root) {
    specs = buildRootSpecs(props);
  } else {
    parentNodeStore = getContext('tilez-internal')!;
    parentNode = get(parentNodeStore) as TileNode;
  }

  const node = new TileNodeFactory(props, { specs, parentNode }).build();
  if (!node.props.padding && parentNode)
    node.props.padding = parentNode.props.padding;

  const nodeStore: Writable<TileNode> = writable(node);

  if (parentNodeStore && parentNode) {
    if (!parentNode.hasChildren)
      parentNodeStore.subscribe((parentNode: TileNode) => {
        parentNode.updateChildrenSpecs();
      });

    parentNodeStore.update((parentNode: TileNode) => {
      parentNode.addChild(nodeStore);

      return parentNode;
    });
  }

  const specsStore = writable(node.specs);

  nodeStore.subscribe((node: TileNode) => {
    specsStore.update((specs: TileSpecs) => {
      specs = node.specs!;

      return specs;
    });
  });

  setContext('tilez', specsStore);
  setContext('tilez-internal', nodeStore);

  return {
    ...nodeStore,
    updateSpecs: (
      width: TypeTilePropsDimension,
      height: TypeTilePropsDimension,
    ) => {
      nodeStore.update((node: TileNode) => {
        if (!node.specs) return node;

        const propsWidth = new TilePropsDimensionFactory(
          'width',
          width,
        ).build();

        const propsHeight = new TilePropsDimensionFactory(
          'height',
          height,
        ).build();

        node.specs.width = propsWidth.value;
        node.specs.height = propsHeight.value;

        return node;
      });
    },
  };
}

function buildRootSpecs(props: TypeTileProps): TileSpecs {
  const { width, height } = props;
  const errorMsg =
    'Root component requires explicit absolute width and height!';

  if (!width || !height) throw new Error(errorMsg);

  const propsWidth = new TilePropsDimensionFactory('width', width).build();
  const propsHeight = new TilePropsDimensionFactory('height', height).build();

  if (propsWidth.unit !== 'px' || propsHeight.unit !== 'px')
    throw new Error(errorMsg);

  return new TileSpecs(propsWidth.value, propsHeight.value, 0, 0, 0, 0);
}
