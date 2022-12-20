import { expect, describe, it } from 'vitest';

import { TilePropsDimensionsAccessor } from '$lib/valueObjects/tileProps';
import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

describe('TilePropsDimensionsAccessor', () => {
  it('returns size, unit and value', () => {
    const propsDimensions = new TilePropsDimensionsFactory(10, '20%').build();

    const widthAccessor = new TilePropsDimensionsAccessor(
      propsDimensions,
      'width',
    );
    expect(widthAccessor.size).toEqual(10);
    expect(widthAccessor.unit).toEqual('px');
    expect(widthAccessor.value).toEqual(10);

    const heightAccessor = new TilePropsDimensionsAccessor(
      propsDimensions,
      'height',
    );
    expect(heightAccessor.size).toBeUndefined();
    expect(heightAccessor.unit).toEqual('%');
    expect(heightAccessor.value).toEqual(0.2);
  });
});
