import { expect, describe, it } from 'vitest';

import type {
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
} from '$lib/types/tileProps.type';

import type { TileNode } from '$lib/entities/tileNode';
import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TileSpecsCalculation } from '$lib/services/tileSpecsCalculation';

const propsDimensions = {
  width: 1000,
  height: 1000,
};

const calc = (node: TileNode) => {
  return new TileSpecsCalculation(
    node.props.stack,
    node.specs!,
    node.children.map(({ props }) => props),
  ).call();
};

describe('TileSpecsCalculation', () => {
  it('creates no specs if there are no children', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([]);
  });

  it('stacks horizontally with absolute widths', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      outerPadding: 10,
      innerPadding: 5,
    }).build();
    new TileNodeFactory({ width: 940 }, root).build();
    new TileNodeFactory({ width: 35 }, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([
      new TileSpecs(940, 980, 10, 10, 10, 10, 5, 0, 'left', 'top'),
      new TileSpecs(35, 980, 955, 10, 955, 10, 5, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(500, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(500, 1000, 500, 0, 500, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(1000, 500, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(1000, 500, 0, 500, 0, 500, 0, 0, 'left', 'top'),
    ]);
  });

  it('does not stack if no "stack" is provided', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([
      new TileSpecs(1000, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(1000, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(500, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(500, 1000, 500, 0, 500, 0, 0, 0, 'left', 'top'),
    ]);

    expect(childChildrenSpecs).toEqual([
      new TileSpecs(500, 1000, 500, 0, 0, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(500, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(200, 1000, 500, 0, 500, 0, 0, 0, 'left', 'top'),
      new TileSpecs(300, 1000, 700, 0, 700, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(600, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(200, 1000, 600, 0, 600, 0, 0, 0, 'left', 'top'),
      new TileSpecs(200, 1000, 800, 0, 800, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(600, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 1000, 600, 0, 600, 0, 0, 0, 'left', 'top'),
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

  it('cuts of px tile when there is not enough space due to outer padding', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      outerPadding: 10,
    }).build();
    new TileNodeFactory({ width: 990 }, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([
      new TileSpecs(980, 980, 10, 10, 10, 10, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top'),
    ]);
  });

  it('renders no flex child tile when there is no space left (because of px size)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({ width: 2000 }, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([
      new TileSpecs(0, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(1000, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(500, 500, 250, 250, 250, 250, 0, 0, 'center', 'center'),
    ]);
  });

  it('considers "hAlign" for horizontal layout', () => {
    const hAlignSpecsFor = (hAlign: TypeTilePropsHAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'horizontal',
        hAlign,
      }).build();
      new TileNodeFactory({ width: '30%', height: '60%' }, root).build();
      new TileNodeFactory({ width: '40%', height: '40%' }, root).build();

      return calc(root);
    };

    expect(hAlignSpecsFor('left')).toEqual([
      new TileSpecs(300, 600, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 300, 0, 300, 0, 0, 0, 'left', 'top'),
    ]);

    expect(hAlignSpecsFor('center')).toEqual([
      new TileSpecs(300, 600, 150, 0, 150, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 450, 0, 450, 0, 0, 0, 'left', 'top'),
    ]);

    expect(hAlignSpecsFor('right')).toEqual([
      new TileSpecs(300, 600, 300, 0, 300, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 600, 0, 600, 0, 0, 0, 'left', 'top'),
    ]);
  });

  it('considers "vAlign" of parent for horizontal layout', () => {
    const vAlignSpecsFor = (vAlign: TypeTilePropsVAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'horizontal',
        vAlign,
      }).build();
      new TileNodeFactory({ width: '30%', height: '60%' }, root).build();
      new TileNodeFactory({ width: '40%', height: '40%' }, root).build();

      return calc(root);
    };

    expect(vAlignSpecsFor('top')).toEqual([
      new TileSpecs(300, 600, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 300, 0, 300, 0, 0, 0, 'left', 'top'),
    ]);

    expect(vAlignSpecsFor('center')).toEqual([
      new TileSpecs(300, 600, 0, 200, 0, 200, 0, 0, 'left', 'center'),
      new TileSpecs(400, 400, 300, 300, 300, 300, 0, 0, 'left', 'center'),
    ]);

    expect(vAlignSpecsFor('bottom')).toEqual([
      new TileSpecs(300, 600, 0, 400, 0, 400, 0, 0, 'left', 'bottom'),
      new TileSpecs(400, 400, 300, 600, 300, 600, 0, 0, 'left', 'bottom'),
    ]);
  });

  it('considers "vAlign" of child for horizontal layout', () => {
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

      return calc(root);
    };

    expect(vAlignSpecsFor('top')).toEqual([
      new TileSpecs(300, 600, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 300, 0, 300, 0, 0, 0, 'left', 'top'),
    ]);

    expect(vAlignSpecsFor('center')).toEqual([
      new TileSpecs(300, 600, 0, 200, 0, 200, 0, 0, 'left', 'center'),
      new TileSpecs(400, 400, 300, 300, 300, 300, 0, 0, 'left', 'center'),
    ]);

    expect(vAlignSpecsFor('bottom')).toEqual([
      new TileSpecs(300, 600, 0, 400, 0, 400, 0, 0, 'left', 'bottom'),
      new TileSpecs(400, 400, 300, 600, 300, 600, 0, 0, 'left', 'bottom'),
    ]);
  });

  it('considers "vAlign" for vertical layout', () => {
    const vAlignSpecsFor = (vAlign: TypeTilePropsVAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'vertical',
        vAlign,
      }).build();
      new TileNodeFactory({ width: '60%', height: '30%' }, root).build();
      new TileNodeFactory({ width: '40%', height: '40%' }, root).build();

      return calc(root);
    };

    expect(vAlignSpecsFor('top')).toEqual([
      new TileSpecs(600, 300, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 0, 300, 0, 300, 0, 0, 'left', 'top'),
    ]);

    expect(vAlignSpecsFor('center')).toEqual([
      new TileSpecs(600, 300, 0, 150, 0, 150, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 0, 450, 0, 450, 0, 0, 'left', 'top'),
    ]);

    expect(vAlignSpecsFor('bottom')).toEqual([
      new TileSpecs(600, 300, 0, 300, 0, 300, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 0, 600, 0, 600, 0, 0, 'left', 'top'),
    ]);
  });

  it('considers "hAlign" of parent for vertical layout', () => {
    const hAlignSpecsFor = (hAlign: TypeTilePropsHAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'vertical',
        hAlign,
      }).build();
      new TileNodeFactory({ width: '30%', height: '60%' }, root).build();
      new TileNodeFactory({ width: '40%', height: '40%' }, root).build();

      return calc(root);
    };

    expect(hAlignSpecsFor('left')).toEqual([
      new TileSpecs(300, 600, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 0, 600, 0, 600, 0, 0, 'left', 'top'),
    ]);

    expect(hAlignSpecsFor('center')).toEqual([
      new TileSpecs(300, 600, 350, 0, 350, 0, 0, 0, 'center', 'top'),
      new TileSpecs(400, 400, 300, 600, 300, 600, 0, 0, 'center', 'top'),
    ]);

    expect(hAlignSpecsFor('right')).toEqual([
      new TileSpecs(300, 600, 700, 0, 700, 0, 0, 0, 'right', 'top'),
      new TileSpecs(400, 400, 600, 600, 600, 600, 0, 0, 'right', 'top'),
    ]);
  });

  it('considers "hAlign" of child for vertical layout', () => {
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

      return calc(root);
    };

    expect(hAlignSpecsFor('left')).toEqual([
      new TileSpecs(300, 600, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 400, 0, 600, 0, 600, 0, 0, 'left', 'top'),
    ]);

    expect(hAlignSpecsFor('center')).toEqual([
      new TileSpecs(300, 600, 350, 0, 350, 0, 0, 0, 'center', 'top'),
      new TileSpecs(400, 400, 300, 600, 300, 600, 0, 0, 'center', 'top'),
    ]);

    expect(hAlignSpecsFor('right')).toEqual([
      new TileSpecs(300, 600, 700, 0, 700, 0, 0, 0, 'right', 'top'),
      new TileSpecs(400, 400, 600, 600, 600, 600, 0, 0, 'right', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(450, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(150, 1000, 450, 0, 450, 0, 0, 0, 'left', 'top'),
      new TileSpecs(400, 1000, 600, 0, 600, 0, 0, 0, 'left', 'top'),
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

    expect(childrenSpecs).toEqual([
      new TileSpecs(1000, 1000, 0, 0, 0, 0, 0, 0, 'left', 'top'),
      new TileSpecs(0, 1000, 1000, 0, 1000, 0, 0, 0, 'left', 'top'),
    ]);
  });

  it('selects number of horizontal flex tiles such that each tile has size >= 1', () => {
    const root = new TileNodeFactory({
      width: 7,
      height: 1,
      stack: 'horizontal',
      innerPadding: 2,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([
      new TileSpecs(1, 1, 0, 0, 0, 0, 2, 0, 'left', 'top'),
      new TileSpecs(1, 1, 3, 0, 3, 0, 2, 0, 'left', 'top'),
      new TileSpecs(1, 1, 6, 0, 6, 0, 2, 0, 'left', 'top'),
      new TileSpecs(0, 1, 9, 0, 9, 0, 2, 0, 'left', 'top'),
      new TileSpecs(0, 1, 9, 0, 9, 0, 2, 0, 'left', 'top'),
    ]);
  });

  it('selects number of vertical flex tiles such that each tile has size >= 1', () => {
    const root = new TileNodeFactory({
      width: 17,
      height: 35,
      stack: 'vertical',
      innerPadding: 8,
      outerPadding: 8,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = calc(root);

    expect(childrenSpecs).toEqual([
      new TileSpecs(1, 1, 8, 8, 8, 8, 8, 0, 'left', 'top'),
      new TileSpecs(1, 1, 8, 17, 8, 17, 8, 0, 'left', 'top'),
      new TileSpecs(1, 1, 8, 26, 8, 26, 8, 0, 'left', 'top'),
      new TileSpecs(1, 0, 8, 35, 8, 35, 8, 0, 'left', 'top'),
    ]);
  });
});
