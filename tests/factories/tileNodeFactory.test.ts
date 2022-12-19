import { expect, describe, it } from 'vitest';

import { TileNodeFactory } from '$lib/factories/tileNodeFactory';

describe('TileNodeFactory', () => {
  it('throws an error if there is no parent node and no props dimensions', () => {
    expect(() => new TileNodeFactory({}).build()).toThrowError(
      'Root tile requires absolute width and height!',
    );
  });

  it('sets specs according to given props if there is no parent node', () => {
    const width = 741;
    const height = 381;
    const innerPadding = 10;
    const outerPadding = 5;
    const hAlign = 'right';
    const vAlign = 'bottom';

    const node = new TileNodeFactory({
      width,
      height,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
    }).build();
    const specs = node.specs;

    expect(specs?.width).toEqual(width);
    expect(specs?.height).toEqual(height);
    expect(specs?.innerPadding).toEqual(innerPadding);
    expect(specs?.outerPadding).toEqual(outerPadding);
    expect(specs?.hAlign).toEqual(hAlign);
    expect(specs?.vAlign).toEqual(vAlign);
  });
});
