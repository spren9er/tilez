import { expect, describe, it } from 'vitest';

import type { TypeTilePropsAlign } from '$lib/types/tileProps.type';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

describe('TilePropsFactory', () => {
  it('passes through "stack" and "align" props', () => {
    const stack = 'horizontal';
    const align = 'center';
    const props = new TilePropsFactory({ stack, align }).build();

    expect(props.stack).toEqual(stack);
    expect(props.align).toEqual(align);
  });

  it('parses prop "padding" when given as string', () => {
    const props = new TilePropsFactory({ padding: '2px' }).build();

    expect(props.padding).toEqual(2);
  });

  it('validates prop "align"', () => {
    ['left', 'right', 'top', 'bottom', 'center'].forEach((align: string) => {
      const props = new TilePropsFactory({
        align: align as TypeTilePropsAlign,
      }).build();

      expect(props.align).toEqual(align);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.align).toBeUndefined();

    expect(() => {
      new TilePropsFactory({ align: 'middle' as TypeTilePropsAlign }).build();
    }).toThrowError(
      'Tile prop "align" must be one of "left", "right", "top", "bottom", "center"!',
    );
  });
});
