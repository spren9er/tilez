import type { TilePropsDimension } from './tilePropsDimension';

export class TilePropsDimensions {
  constructor(private propsDimensions: TilePropsDimension[]) {}

  public dimensionFor(
    type: 'width' | 'height',
  ): TilePropsDimension | undefined {
    return this.propsDimensions.find((size) => size.type === type);
  }

  public valueFor(type: 'width' | 'height'): number | undefined {
    const propsDimension = this.dimensionFor(type);
    if (!propsDimension) return;

    return propsDimension.value;
  }

  public unitFor(type: 'width' | 'height'): 'px' | '%' | undefined {
    const propsDimension = this.dimensionFor(type);
    if (!propsDimension) return;

    return propsDimension.unit;
  }

  public compare(
    propsDimensions: TilePropsDimensions,
    type: 'width' | 'height',
  ) {
    const propsDimensionA = this.dimensionFor(type);
    const propsDimensionB = propsDimensions.dimensionFor(type);

    if (!propsDimensionA && !propsDimensionB) return 0;
    if (!propsDimensionB) return 1;
    if (!propsDimensionA) return -1;

    return propsDimensionA.compare(propsDimensionB);
  }
}
