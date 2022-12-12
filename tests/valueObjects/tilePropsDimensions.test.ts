import { expect, describe, it } from 'vitest';

import { TilePropsDimension } from '$lib/valueObjects/tilePropsDimension';
import { TilePropsDimensions } from '$lib/valueObjects/tilePropsDimensions';

describe('TilePropsDimensions', () => {
  it('gets specific props dimension', () => {
    const propsDimension = new TilePropsDimension('width', 100, 'px');
    const propsDimensions = new TilePropsDimensions([propsDimension]);

    expect(propsDimensions.dimensionFor('width')).toEqual(propsDimension);
    expect(propsDimensions.dimensionFor('height')).toBeUndefined();
  });

  it('gets unit of specific dimension', () => {
    const propsWidth = new TilePropsDimension('width', 100, 'px');
    const propsHeight = new TilePropsDimension('height', 100, '%');
    const propsDimensions = new TilePropsDimensions([propsWidth, propsHeight]);

    expect(propsDimensions.unitFor('width')).toEqual('px');
    expect(propsDimensions.unitFor('height')).toEqual('%');
  });

  it('has undefined units if there are no dimensions given', () => {
    const emptyPropsDimensions = new TilePropsDimensions([]);

    expect(emptyPropsDimensions.unitFor('width')).toBeUndefined();
    expect(emptyPropsDimensions.unitFor('height')).toBeUndefined();
  });

  it('calculates value of specific dimension', () => {
    const propsDimension = new TilePropsDimension('width', 0.9, '%');
    const propsDimensions = new TilePropsDimensions([propsDimension]);

    expect(propsDimensions.valueFor('width')).toEqual(0.9);
    expect(propsDimensions.valueFor('height')).toBeUndefined();
  });

  it('has undefined values if there are no dimensions given', () => {
    const emptyPropsDimensions = new TilePropsDimensions([]);

    expect(emptyPropsDimensions.valueFor('width')).toBeUndefined();
    expect(emptyPropsDimensions.valueFor('height')).toBeUndefined();
  });

  it('can be compared with other props dimensions if not both dimensions are available', () => {
    const propsDimensionA = new TilePropsDimension('width', 100, 'px');
    const propsDimensionsA = new TilePropsDimensions([propsDimensionA]);

    const propsDimensionB = new TilePropsDimension('height', 100, 'px');
    const propsDimensionsB = new TilePropsDimensions([propsDimensionB]);

    expect(propsDimensionsA.compare(propsDimensionsB, 'width')).toEqual(1);
    expect(propsDimensionsA.compare(propsDimensionsB, 'height')).toEqual(-1);

    const propsDimensionsC = new TilePropsDimensions([]);

    expect(propsDimensionsC.compare(propsDimensionsC, 'width')).toEqual(0);
    expect(propsDimensionsC.compare(propsDimensionsC, 'height')).toEqual(0);
  });
});
