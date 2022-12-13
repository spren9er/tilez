import { expect, describe, it } from 'vitest';

import type { TypeTilePropsAlign } from '$lib/types/tileProps.type';

import { TileNode } from '$lib/entities/tileNode';
import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';
import { TileSpecsCalculation } from '$lib/services/tileSpecsCalculation';

const propsDimensions = {
  width: 1000,
  height: 1000,
};

describe('TileSpecsCalculation', () => {
  it('throws an error if no specs are available', () => {
    const props = new TilePropsFactory(propsDimensions).build();
    const node = new TileNode(props);

    expect(() => new TileSpecsCalculation(node)).toThrowError(
      'Specs of tile are required for calculating specs of children nodes!',
    );
  });

  it('creates no specs if there are no children', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([]);
  });

  it('stacks horizontally (equally distributed as no widths are given)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(500, 1000, 0, 0, 0, 0),
      new TileSpecs(500, 1000, 500, 0, 500, 0),
    ]);
  });

  it('stacks vertically (equally distributed as no heights are given)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'vertical',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(1000, 500, 0, 0, 0, 0),
      new TileSpecs(1000, 500, 0, 500, 0, 500),
    ]);
  });

  it('doesn\'t stack if no "stack" is provided', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(1000, 1000, 0, 0, 0, 0),
      new TileSpecs(1000, 1000, 0, 0, 0, 0),
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

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(500, 1000, 0, 0, 0, 0),
      new TileSpecs(200, 1000, 500, 0, 500, 0),
      new TileSpecs(300, 1000, 700, 0, 700, 0),
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

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(600, 1000, 0, 0, 0, 0),
      new TileSpecs(200, 1000, 600, 0, 600, 0),
      new TileSpecs(200, 1000, 800, 0, 800, 0),
    ]);
  });

  it('distributes tiles as long as space is available and possibly cuts off last rendered tile', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({ width: '60%' }, root).build();
    new TileNodeFactory({ width: '60%' }, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(600, 1000, 0, 0, 0, 0),
      new TileSpecs(400, 1000, 600, 0, 600, 0),
    ]);
  });

  it('considers padding only for leaf tiles', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'vertical',
      padding: 5,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(990, 490, 5, 5, 5, 5),
      new TileSpecs(990, 490, 5, 505, 5, 505),
    ]);
  });

  it('accepts overriding paddings of inner node tiles', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'vertical',
      padding: 5,
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({ padding: 10 }, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(990, 490, 5, 5, 5, 5),
      new TileSpecs(980, 480, 10, 510, 10, 510),
    ]);
  });

  it('recognizes when padding is larger than width or height (no negative size)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
      padding: 10,
    }).build();
    new TileNodeFactory({ width: 990 }, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new TileSpecsCalculation(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(970, 980, 10, 10, 10, 10),
      new TileSpecs(0, 980, 1000, 10, 1000, 10),
    ]);
  });

  it('considers "align" parameters for horizontal layout', () => {
    const alignSpecsFor = (align: TypeTilePropsAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'horizontal',
      }).build();
      new TileNodeFactory({ height: '60%', align }, root).build();
      new TileNodeFactory({ height: '40%', align }, root).build();

      return new TileSpecsCalculation(root).call();
    };

    expect(alignSpecsFor('top')).toEqual([
      new TileSpecs(500, 600, 0, 0, 0, 0),
      new TileSpecs(500, 400, 500, 0, 500, 0),
    ]);

    expect(alignSpecsFor('center')).toEqual([
      new TileSpecs(500, 600, 0, 200, 0, 200),
      new TileSpecs(500, 400, 500, 300, 500, 300),
    ]);

    expect(alignSpecsFor('bottom')).toEqual([
      new TileSpecs(500, 600, 0, 400, 0, 400),
      new TileSpecs(500, 400, 500, 600, 500, 600),
    ]);
  });

  it('considers "align" parameters for vertical layout', () => {
    const alignSpecsFor = (align: TypeTilePropsAlign) => {
      const root = new TileNodeFactory({
        ...propsDimensions,
        stack: 'vertical',
      }).build();
      new TileNodeFactory({ width: '60%', align }, root).build();
      new TileNodeFactory({ width: '40%', align }, root).build();

      return new TileSpecsCalculation(root).call();
    };

    expect(alignSpecsFor('left')).toEqual([
      new TileSpecs(600, 500, 0, 0, 0, 0),
      new TileSpecs(400, 500, 0, 500, 0, 500),
    ]);

    expect(alignSpecsFor('center')).toEqual([
      new TileSpecs(600, 500, 200, 0, 200, 0),
      new TileSpecs(400, 500, 300, 500, 300, 500),
    ]);

    expect(alignSpecsFor('right')).toEqual([
      new TileSpecs(600, 500, 400, 0, 400, 0),
      new TileSpecs(400, 500, 600, 500, 600, 500),
    ]);
  });
});
