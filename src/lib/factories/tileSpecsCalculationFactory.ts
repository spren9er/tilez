import type {
  TypeTilePropsStack,
  TypeTilePropsMode,
} from '$lib/types/tileProps.type';
import type { TileSpecs } from '$lib/entities/tileSpecs';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileSpecsCalculationSizing } from '$lib/services/tileSpecsCalculationSizing';
import { TileSpecsCalculationSpacing } from '$lib/services/tileSpecsCalculationSpacing';

export class TileSpecsCalculationFactory {
  constructor(
    private mode: TypeTilePropsMode,
    private specs: TileSpecs,
    private props: TileProps[],
    private root: boolean,
    private stack?: TypeTilePropsStack,
  ) {}

  public build() {
    if (this.mode === 'spacing') {
      return new TileSpecsCalculationSpacing(
        this.specs,
        this.props,
        this.root,
        this.stack,
      );
    } else {
      return new TileSpecsCalculationSizing(
        this.specs,
        this.props,
        this.root,
        this.stack,
      );
    }
  }
}
