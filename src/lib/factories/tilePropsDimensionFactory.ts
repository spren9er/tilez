import type { TypeTilePropsDimension } from '$lib/types/tileProps.type';

import { TilePropsDimension } from '$lib/valueObjects/tilePropsDimension';

export class TilePropsDimensionFactory {
  constructor(
    private type: 'width' | 'height',
    private rawPropsDimension: TypeTilePropsDimension,
  ) {}

  public build() {
    const { value, unit } = this.parseRawPropsDimension();
    return new TilePropsDimension(this.type, value, unit);
  }

  private parseRawPropsDimension(): { value: number; unit: 'px' | '%' } {
    if (typeof this.rawPropsDimension === 'string') {
      const sizeNumber = parseInt(this.rawPropsDimension);
      const pSizeNumber = parseFloat(this.rawPropsDimension);

      if (this.rawPropsDimension.endsWith('%')) {
        return {
          value: pSizeNumber / 100,
          unit: '%',
        };
      } else if (this.rawPropsDimension.endsWith('px')) {
        return { value: sizeNumber, unit: 'px' };
      } else if (this.rawPropsDimension.includes('.')) {
        return { value: pSizeNumber, unit: '%' };
      } else if (pSizeNumber >= 0 && pSizeNumber < 1) {
        return { value: pSizeNumber, unit: '%' };
      }

      return { value: sizeNumber, unit: 'px' };
    }

    // all numbers less than 1 are interpreted as percentage
    return this.rawPropsDimension < 1
      ? { value: this.rawPropsDimension, unit: '%' }
      : { value: this.rawPropsDimension, unit: 'px' };
  }
}
