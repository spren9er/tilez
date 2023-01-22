import type { TileSpecs } from '$lib/entities/tileSpecs';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileSpecsCalculationSizing } from '$lib/services/tileSpecsCalculationSizing';
import { TileSpecsCalculationSpacing } from '$lib/services/tileSpecsCalculationSpacing';

export class TileSpecsCalculationFactory {
  constructor(
    private specs: TileSpecs,
    private props: TileProps[],
    private root: boolean,
  ) {}

  public build() {
    if (this.specs.mode === 'spacing') {
      return new TileSpecsCalculationSpacing(this.specs, this.props, this.root);
    } else {
      return new TileSpecsCalculationSizing(this.specs, this.props, this.root);
    }
  }
}
