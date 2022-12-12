import { expect, describe, it } from 'vitest';

import { TileNode } from '$lib/entities/tileNode';
import { TileSpecs } from '$lib/valueObjects/tileSpecs';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';
import { CalculateSpecs } from '$lib/services/calculateSpecs';

const propsDimensions = {
  width: 1000,
  height: 1000,
};

describe('CalculateSpecs', () => {
  it('throws an error if no specs are available', () => {
    const props = new TilePropsFactory(propsDimensions).build();
    const node = new TileNode(props);

    expect(() => new CalculateSpecs(node)).toThrowError(
      'Specs of tile are required for calculating specs of children nodes!',
    );
  });

  it('creates no specs if there are no children', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    const childrenSpecs = new CalculateSpecs(root).call();

    expect(childrenSpecs).toEqual([]);
  });

  it('stacks horizontally (equally distributed as no widths are given)', () => {
    const root = new TileNodeFactory({
      ...propsDimensions,
      stack: 'horizontal',
    }).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new CalculateSpecs(root).call();

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

    const childrenSpecs = new CalculateSpecs(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(1000, 500, 0, 0, 0, 0),
      new TileSpecs(1000, 500, 0, 500, 0, 500),
    ]);
  });

  it('doesn\'t stack if no "stack" is provided', () => {
    const root = new TileNodeFactory(propsDimensions).build();
    new TileNodeFactory({}, root).build();
    new TileNodeFactory({}, root).build();

    const childrenSpecs = new CalculateSpecs(root).call();

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

    const childrenSpecs = new CalculateSpecs(root).call();

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

    const childrenSpecs = new CalculateSpecs(root).call();

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

    const childrenSpecs = new CalculateSpecs(root).call();

    expect(childrenSpecs).toEqual([
      new TileSpecs(600, 1000, 0, 0, 0, 0),
      new TileSpecs(400, 1000, 600, 0, 600, 0),
    ]);
  });
});
