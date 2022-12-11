import { expect, describe, it } from 'vitest';

import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

describe('TilePropsDimensionsFactory', () => {
  it('builds if no dimensions are given', () => {
    const propsDimensions = new TilePropsDimensionsFactory().build();

    expect(propsDimensions.dimensionFor('width')).toBeUndefined();
    expect(propsDimensions.dimensionFor('height')).toBeUndefined();
  });
});
