import { expect, describe, it } from 'vitest';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

describe('TilePropsFactory', () => {
  it('passes through "stack" and "align" props', () => {
    const stack = 'horizontal';
    const align = 'center';
    const props = new TilePropsFactory({ stack, align }).build();

    expect(props.stack).toEqual(stack);
    expect(props.align).toEqual(align);
  });

  it('parses "padding" prop when given as string', () => {
    const props = new TilePropsFactory({ padding: '2px' }).build();

    expect(props.padding).toEqual(2);
  });
});
