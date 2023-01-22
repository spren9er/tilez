import { expect, describe, it } from 'vitest';

import type { TypeTilePropsMode } from '$lib/types/tileProps.type';

import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileSpecsCalculationSizing } from '$lib/services/tileSpecsCalculationSizing';
import { TileSpecsCalculationSpacing } from '$lib/services/tileSpecsCalculationSpacing';
import { TileSpecsCalculationFactory } from '$lib/factories/tileSpecsCalculationFactory';

const calculationForMode = (mode: TypeTilePropsMode) => {
  const specs = new TileSpecs(
    100,
    100,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    'left',
    'top',
    'plain',
    mode,
    'horizontal',
  );

  return new TileSpecsCalculationFactory(specs, [], true).build();
};

describe('TileSpecsCalculationFactory', () => {
  it('builds according to give mode', () => {
    expect(calculationForMode('sizing')).toBeInstanceOf(
      TileSpecsCalculationSizing,
    );
    expect(calculationForMode('spacing')).toBeInstanceOf(
      TileSpecsCalculationSpacing,
    );
  });
});
