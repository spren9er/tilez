import { expect, describe, it } from 'vitest';

import type {
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
} from '$lib/types/tileProps.type';

import type { TileNode } from '$lib/entities/tileNode';
import type { TileSpecs } from '$lib/entities/tileSpecs';

import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TileSpecsCalculationSpacing } from '$lib/services/tileSpecsCalculationSpacing';

const propsDimensions = {
  width: 1000,
  height: 1000,
};

const calc = (node: TileNode) => {
  return new TileSpecsCalculationSpacing(
    node.specs,
    node.children.map(({ props }) => props),
    node.isRoot,
  ).call();
};

const numbersFrom = (specs: TileSpecs[]) => {
  return specs.map((spec: TileSpecs) => {
    const {
      width,
      height,
      rootX,
      rootY,
      subRootX,
      subRootY,
      parentX,
      parentY,
    } = spec;

    return [width, height, rootX, rootY, subRootX, subRootY, parentX, parentY];
  });
};

describe('TileSpecsCalculationSpacing', () => {
  it('creates no specs if there are no children', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([]);
  });

  it('stacks horizontally with absolute widths', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      outerPadding: 10,
      innerPadding: 6,
    }).build();
    new TileNodeFactory({ width: 944 }, root).build();
    new TileNodeFactory({ width: 36 }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [938, 974, 13, 13, 13, 13, 13, 13],
      [30, 974, 957, 13, 957, 13, 957, 13],
    ]);
  });

  it('stacks horizontally (equally distributed as no widths are given)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [500, 1000, 0, 0, 0, 0, 0, 0],
      [500, 1000, 500, 0, 500, 0, 500, 0],
    ]);
  });

  it('stacks vertically (equally distributed as no heights are given)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'vertical',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [1000, 500, 0, 0, 0, 0, 0, 0],
      [1000, 500, 0, 500, 0, 500, 0, 500],
    ]);
  });

  it('does not stack if no "stack" is provided', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [1000, 1000, 0, 0, 0, 0, 0, 0],
      [1000, 1000, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('sets relative positions of children to zero if no "stack" is provided', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();

    // child has no "stack", but a child
    const child = new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, child).build();

    const childrenSpecs = calc(root);
    const childChildrenSpecs = calc(child);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [500, 1000, 0, 0, 0, 0, 0, 0],
      [500, 1000, 500, 0, 500, 0, 500, 0],
    ]);

    expect(numbersFrom(childChildrenSpecs)).toEqual([
      [500, 1000, 500, 0, 500, 0, 0, 0],
    ]);
  });

  it('distributes tiles relatively (w.r.t. remaining size) when stacked with percent values', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: 500 }, root).build();
    new TileNodeFactory({ width: '40%' }, root).build();
    new TileNodeFactory({ width: '60%' }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [500, 1000, 0, 0, 0, 0, 0, 0],
      [200, 1000, 500, 0, 500, 0, 500, 0],
      [300, 1000, 700, 0, 700, 0, 700, 0],
    ]);
  });

  it('distributes tiles equally (w.r.t. remaining size) when stacked with no widths', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: '60%' }, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [600, 1000, 0, 0, 0, 0, 0, 0],
      [200, 1000, 600, 0, 600, 0, 600, 0],
      [200, 1000, 800, 0, 800, 0, 800, 0],
    ]);
  });

  it('distributes tiles as long as space is available and possibly cuts off last rendered tile', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: '60%' }, root).build();
    new TileNodeFactory({ width: '60%' }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [600, 1000, 0, 0, 0, 0, 0, 0],
      [400, 1000, 600, 0, 600, 0, 600, 0],
    ]);
  });

  it('handles 100% width and height correctly within stack', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: '100%', height: '100%' }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [1000, 1000, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('accepts overriding inner paddings of node tiles', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'vertical',
      innerPadding: 5,
    }).build();
    new TileNodeFactory({ innerPadding: 10 }, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs[0].innerPadding).toEqual(10);
  });

  it('cuts of px tile which does not fit because it is too long', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      innerPadding: 10,
    }).build();
    new TileNodeFactory({ width: 2000 }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([[990, 990, 5, 5, 5, 5, 5, 5]]);
  });

  it('cuts of px tile which does not fit because of outer padding', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      outerPadding: 10,
    }).build();
    new TileNodeFactory({ width: 990 }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [980, 980, 10, 10, 10, 10, 10, 10],
    ]);
  });

  it('renders no child tile when parent has zero size', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: 100 }, root).build();

    if (root.specs) root.specs.width = 0; // hidden due to parent tiles

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([[0, 0, 0, 0, 0, 0, 0, 0]]);
  });

  it('renders no flex child tile when there is no space left (because of px size)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({ width: 2000 }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1000, 1000, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('considers "hAlign" and "vAlign" for non-stacked tiles', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
    }).build();
    new TileNodeFactory(
      { width: '50%', height: '50%', hAlign: 'center', vAlign: 'center' },
      root,
    ).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [500, 500, 250, 250, 250, 250, 250, 250],
    ]);
  });

  it('considers "hAlign" for horizontal layout', () => {
    const hAlignSpecsFor = (hAlign: TypeTilePropsHAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'horizontal',
      }).build();
      new TileNodeFactory(
        { width: '30%', height: '60%', hAlign },
        root,
      ).build();
      new TileNodeFactory(
        { width: '40%', height: '40%', hAlign },
        root,
      ).build();

      return numbersFrom(calc(root)).map((specs) => [...specs, hAlign]);
    };

    expect(hAlignSpecsFor('left')).toEqual([
      [300, 600, 0, 0, 0, 0, 0, 0, 'left'],
      [400, 400, 300, 0, 300, 0, 300, 0, 'left'],
    ]);

    expect(hAlignSpecsFor('center')).toEqual([
      [300, 600, 150, 0, 150, 0, 150, 0, 'center'],
      [400, 400, 450, 0, 450, 0, 450, 0, 'center'],
    ]);

    expect(hAlignSpecsFor('right')).toEqual([
      [300, 600, 300, 0, 300, 0, 300, 0, 'right'],
      [400, 400, 600, 0, 600, 0, 600, 0, 'right'],
    ]);
  });

  it('considers "vAlign" for horizontal layout', () => {
    const vAlignSpecsFor = (vAlign: TypeTilePropsVAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'horizontal',
      }).build();
      new TileNodeFactory(
        { width: '30%', height: '60%', vAlign },
        root,
      ).build();
      new TileNodeFactory(
        { width: '40%', height: '40%', vAlign },
        root,
      ).build();

      return numbersFrom(calc(root)).map((specs) => [...specs, vAlign]);
    };

    expect(vAlignSpecsFor('top')).toEqual([
      [300, 600, 0, 0, 0, 0, 0, 0, 'top'],
      [400, 400, 300, 0, 300, 0, 300, 0, 'top'],
    ]);

    expect(vAlignSpecsFor('center')).toEqual([
      [300, 600, 0, 200, 0, 200, 0, 200, 'center'],
      [400, 400, 300, 300, 300, 300, 300, 300, 'center'],
    ]);

    expect(vAlignSpecsFor('bottom')).toEqual([
      [300, 600, 0, 400, 0, 400, 0, 400, 'bottom'],
      [400, 400, 300, 600, 300, 600, 300, 600, 'bottom'],
    ]);
  });

  it('considers "vAlign" for vertical layout', () => {
    const vAlignSpecsFor = (vAlign: TypeTilePropsVAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'vertical',
      }).build();
      new TileNodeFactory(
        { width: '60%', height: '30%', vAlign },
        root,
      ).build();
      new TileNodeFactory(
        { width: '40%', height: '40%', vAlign },
        root,
      ).build();

      return numbersFrom(calc(root)).map((specs) => [...specs, vAlign]);
    };

    expect(vAlignSpecsFor('top')).toEqual([
      [600, 300, 0, 0, 0, 0, 0, 0, 'top'],
      [400, 400, 0, 300, 0, 300, 0, 300, 'top'],
    ]);

    expect(vAlignSpecsFor('center')).toEqual([
      [600, 300, 0, 150, 0, 150, 0, 150, 'center'],
      [400, 400, 0, 450, 0, 450, 0, 450, 'center'],
    ]);

    expect(vAlignSpecsFor('bottom')).toEqual([
      [600, 300, 0, 300, 0, 300, 0, 300, 'bottom'],
      [400, 400, 0, 600, 0, 600, 0, 600, 'bottom'],
    ]);
  });

  it('considers "hAlign" for vertical layout', () => {
    const hAlignSpecsFor = (hAlign: TypeTilePropsHAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'vertical',
      }).build();
      new TileNodeFactory(
        { width: '30%', height: '60%', hAlign },
        root,
      ).build();
      new TileNodeFactory(
        { width: '40%', height: '40%', hAlign },
        root,
      ).build();

      return numbersFrom(calc(root)).map((specs) => [...specs, hAlign]);
    };

    expect(hAlignSpecsFor('left')).toEqual([
      [300, 600, 0, 0, 0, 0, 0, 0, 'left'],
      [400, 400, 0, 600, 0, 600, 0, 600, 'left'],
    ]);

    expect(hAlignSpecsFor('center')).toEqual([
      [300, 600, 350, 0, 350, 0, 350, 0, 'center'],
      [400, 400, 300, 600, 300, 600, 300, 600, 'center'],
    ]);

    expect(hAlignSpecsFor('right')).toEqual([
      [300, 600, 700, 0, 700, 0, 700, 0, 'right'],
      [400, 400, 600, 600, 600, 600, 600, 600, 'right'],
    ]);
  });

  it('adds a gap between left and right ("hAlign") tiles and cuts off last px tile for horizontal layout', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      innerPadding: 10,
    }).build();
    new TileNodeFactory({ width: '550px', hAlign: 'left' }, root).build();
    new TileNodeFactory({ width: '600px', hAlign: 'right' }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [540, 990, 5, 5, 5, 5, 5, 5],
      [440, 990, 555, 5, 555, 5, 555, 5],
    ]);
  });

  it('reorders tiles according to "hAlign" props in horizontal layout', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: '40%', hAlign: 'center' }, root).build();
    new TileNodeFactory({ width: '20%', hAlign: 'right' }, root).build();
    new TileNodeFactory({ width: '30%', hAlign: 'left' }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [400, 1000, 300, 0, 300, 0, 300, 0],
      [200, 1000, 800, 0, 800, 0, 800, 0],
      [300, 1000, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('returns specs in same order as children', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({ width: '25%' }, root).build();
    new TileNodeFactory({ width: '400px' }, root).build();

    // during calculation children props/specs are sorted twice
    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [450, 1000, 0, 0, 0, 0, 0, 0],
      [150, 1000, 450, 0, 450, 0, 450, 0],
      [400, 1000, 600, 0, 600, 0, 600, 0],
    ]);
  });

  it('sets specs sizes to zero if no more space is available', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: propsDimensions.width + 1 }, root).build();
    new TileNodeFactory({ width: '400px' }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [1000, 1000, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('selects number of horizontal flex tiles such that each tile has size >= 1', () => {
    const root = new TileNodeFactory({
      width: 9,
      height: 3,
      stack: 'horizontal',
      innerPadding: 2,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 4, 1, 4, 1, 4, 1],
      [1, 1, 7, 1, 7, 1, 7, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('selects number of vertical flex tiles such that each tile has size >= 1', () => {
    const root = new TileNodeFactory({
      width: 25,
      height: 43,
      stack: 'vertical',
      innerPadding: 8,
      outerPadding: 8,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [1, 1, 12, 12, 12, 12, 12, 12],
      [1, 1, 12, 21, 12, 21, 12, 21],
      [1, 1, 12, 30, 12, 30, 12, 30],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('does not render tile with relative size when it does not fit', () => {
    const root = new TileNodeFactory({
      width: 100,
      height: 100,
      stack: 'vertical',
      innerPadding: 4,
      outerPadding: 2,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({ height: 88 }, root).build();
    new TileNodeFactory({ height: 0.2 }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [92, 4, 4, 4, 4, 4, 4, 4],
      [92, 84, 4, 12, 4, 12, 4, 12],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('renders correctly when tile with relative size is smaller than tiles w/o height', () => {
    const root = new TileNodeFactory({
      width: 100,
      height: 178,
      stack: 'vertical',
      innerPadding: 4,
      outerPadding: 2,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({ height: 150 }, root).build();
    new TileNodeFactory({ height: 0.2 }, root).build();

    const childrenSpecs = calc(root);

    expect(numbersFrom(childrenSpecs)).toEqual([
      [92, 8, 4, 4, 4, 4, 4, 4],
      [92, 8, 4, 16, 4, 16, 4, 16],
      [92, 146, 4, 28, 4, 28, 4, 28],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });
});
