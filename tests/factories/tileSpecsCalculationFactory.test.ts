import { expect, describe, it } from 'vitest';

import type { TypeTilePropsMode } from '$lib/types/tileProps.type';

import { TileSpecs } from '$lib/entities/tileSpecs';
import { TileSpecsCalculationSizing } from '$lib/services/tileSpecsCalculationSizing';
import { TileSpecsCalculationSpacing } from '$lib/services/tileSpecsCalculationSpacing';
import { TileSpecsCalculationFactory } from '$lib/factories/tileSpecsCalculationFactory';

const calculationForMode = (mode: TypeTilePropsMode) => {
  const specs = new TileSpecs(0, 0, 0, 0, 0, 0, 0, 0, 'left', 'top');

  return new TileSpecsCalculationFactory(
    mode,
    specs,
    [],
    true,
    'horizontal',
  ).build();
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
