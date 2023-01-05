import { expect, describe, it } from 'vitest';

import { TileSpecs } from '$lib/entities/tileSpecs';

const specs = new TileSpecs(100, 200, 0, 0, 0, 0, 0, 0, 'center', 'center');

describe('TileSpecs', () => {
  it('can be copied', () => {
    const copy = specs.copy();

    expect(specs.width).toEqual(copy.width);
    expect(specs.height).toEqual(copy.height);
    expect(specs.absX).toEqual(copy.absX);
    expect(specs.absY).toEqual(copy.absY);
    expect(specs.relX).toEqual(copy.relX);
    expect(specs.relY).toEqual(copy.relY);
    expect(specs.innerPadding).toEqual(copy.innerPadding);
    expect(specs.outerPadding).toEqual(copy.outerPadding);
    expect(specs.hAlign).toEqual(copy.hAlign);
    expect(specs.vAlign).toEqual(copy.vAlign);
  });

  it('has an aspect ratio', () => {
    expect(specs.aspectRatio).toEqual(0.5);
  });

  it('returns an error obtaining aspect ratio when height is zero', () => {
    const emptyTileSpecs = new TileSpecs(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      'center',
      'center',
    );

    expect(() => emptyTileSpecs.aspectRatio).toThrowError('Height is zero!');
  });
});
