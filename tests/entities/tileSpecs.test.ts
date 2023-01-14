import { expect, describe, it } from 'vitest';

import { TileSpecs } from '$lib/entities/tileSpecs';

const specs = new TileSpecs(10, 20, 0, 0, 0, 0, 0, 0, 0, 0, 'center', 'center');
const emptySpecs = new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top');

describe('TileSpecs', () => {
  it('can be copied', () => {
    const copy = specs.copy();

    expect(specs.width).toEqual(copy.width);
    expect(specs.height).toEqual(copy.height);
    expect(specs.rootX).toEqual(copy.rootX);
    expect(specs.rootY).toEqual(copy.rootY);
    expect(specs.subRootX).toEqual(copy.subRootX);
    expect(specs.subRootY).toEqual(copy.subRootY);
    expect(specs.parentX).toEqual(copy.parentX);
    expect(specs.parentY).toEqual(copy.parentY);
    expect(specs.innerPadding).toEqual(copy.innerPadding);
    expect(specs.outerPadding).toEqual(copy.outerPadding);
    expect(specs.hAlign).toEqual(copy.hAlign);
    expect(specs.vAlign).toEqual(copy.vAlign);
  });

  it('has an aspect ratio', () => {
    expect(specs.aspectRatio).toEqual(0.5);
  });

  it('has an empty size or not', () => {
    expect(specs.hasEmptySize).toEqual(false);
    expect(emptySpecs.hasEmptySize).toEqual(true);
  });

  it('returns an error obtaining aspect ratio when height is zero', () => {
    expect(() => emptySpecs.aspectRatio).toThrowError('Height is zero!');
  });
});
