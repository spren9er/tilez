import { expect, describe, it } from 'vitest';

import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

describe('TilePropsDimensionsFactory', () => {
  it('builds if no dimensions are given', () => {
    const propsDimensions = new TilePropsDimensionsFactory().build();

    expect(propsDimensions.dimensionFor('width')).toBeUndefined();
    expect(propsDimensions.dimensionFor('height')).toBeUndefined();
  });

  it('builds if zero dimensions are given', () => {
    const propsDimensions = new TilePropsDimensionsFactory(0, '0').build();

    const width = propsDimensions.dimensionFor('width');
    const height = propsDimensions.dimensionFor('height');

    expect(width?.unit).toEqual('%');
    expect(height?.unit).toEqual('%');
    expect(width?.value).toEqual(0);
    expect(height?.value).toEqual(0);
  });
});
