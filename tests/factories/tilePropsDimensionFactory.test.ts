import { expect, describe, it } from 'vitest';

import type { TilePropsDimension } from '$lib/valueObjects/tilePropsDimension';

import { TilePropsDimensionFactory } from '$lib/factories/tilePropsDimensionFactory';

function jsonFrom(propsDimension: TilePropsDimension) {
  return { value: propsDimension.value, unit: propsDimension.unit };
}

describe('TilePropsDimensionFactory', () => {
  it('builds from numbers greater than or equal 1 (as px)', () => {
    const propsWidth = new TilePropsDimensionFactory('width', 1).build();
    const propsHeight = new TilePropsDimensionFactory('height', 100).build();

    expect(jsonFrom(propsWidth)).toEqual({ value: 1, unit: 'px' });
    expect(jsonFrom(propsHeight)).toEqual({ value: 100, unit: 'px' });
  });

  it('builds from numbers between 0 and 1 (as %)', () => {
    const propsWidth = new TilePropsDimensionFactory('width', 0.1).build();
    const propsHeight = new TilePropsDimensionFactory('height', 0.9).build();

    expect(jsonFrom(propsWidth)).toEqual({ value: 0.1, unit: '%' });
    expect(jsonFrom(propsHeight)).toEqual({ value: 0.9, unit: '%' });
  });

  it('builds from strings', () => {
    const propsWidth = new TilePropsDimensionFactory('width', '0.1').build();
    const propsHeight = new TilePropsDimensionFactory('height', '100').build();

    expect(jsonFrom(propsWidth)).toEqual({ value: 0.1, unit: '%' });
    expect(jsonFrom(propsHeight)).toEqual({ value: 100, unit: 'px' });
  });

  it('builds from strings with %', () => {
    const propsWidth = new TilePropsDimensionFactory('width', '10%').build();
    const propsHeight = new TilePropsDimensionFactory('height', '90%').build();

    expect(jsonFrom(propsWidth)).toEqual({ value: 0.1, unit: '%' });
    expect(jsonFrom(propsHeight)).toEqual({ value: 0.9, unit: '%' });
  });

  it('builds from strings with px', () => {
    const propsWidth = new TilePropsDimensionFactory('width', '10px').build();
    const propsHeight = new TilePropsDimensionFactory('height', '90px').build();

    expect(jsonFrom(propsWidth)).toEqual({ value: 10, unit: 'px' });
    expect(jsonFrom(propsHeight)).toEqual({ value: 90, unit: 'px' });
  });

  it('handles zero', () => {
    const propsAbsWidths = [0, 0.0, '0.0', '0', '0px'].map((width) =>
      new TilePropsDimensionFactory('width', width).build(),
    );

    const zeroAbsolute = { value: 0, unit: 'px' };

    expect(propsAbsWidths.map((width) => jsonFrom(width))).toEqual(
      new Array(5).fill(zeroAbsolute),
    );

    const propsRelWidth = new TilePropsDimensionFactory('width', '0%').build();

    const zeroPercentage = { value: 0, unit: '%' };
    expect(jsonFrom(propsRelWidth)).toEqual(zeroPercentage);
  });

  it('handles 100%', () => {
    const propsWidth = new TilePropsDimensionFactory('width', '100%').build();
    const propsHeight = new TilePropsDimensionFactory('height', '100%').build();

    expect(jsonFrom(propsWidth)).toEqual({ value: 1, unit: '%' });
    expect(jsonFrom(propsHeight)).toEqual({ value: 1, unit: '%' });
  });
});
