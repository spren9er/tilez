import type { Writable } from 'svelte/store';
import { getContext } from 'svelte';

export function getSpecs(): Writable<TileSpecs> {
  return getContext('tilez');
}

export class TileSpecs {
  constructor(
    public width: number,
    public height: number,
    public absX: number,
    public absY: number,
    public relX: number,
    public relY: number,
  ) {}

  public x(x: number) {
    return this.scaleLinear(
      [0, this.width],
      [this.relX, this.relX + this.width],
    )(x);
  }

  public xRev(x: number) {
    return this.scaleLinear(
      [0, this.width],
      [this.relX + this.width, this.relX],
    )(x);
  }

  public y(y: number) {
    return this.scaleLinear(
      [0, this.height],
      [this.relY, this.relY + this.height],
    )(y);
  }

  public yRev(y: number) {
    return this.scaleLinear(
      [0, this.height],
      [this.relY + this.height, this.relY],
    )(y);
  }

  public pX(x: number) {
    return this.scaleLinear([0, 1], [this.relX, this.relX + this.width])(x);
  }

  public pXRev(x: number) {
    return this.scaleLinear([0, 1], [this.relX + this.width, this.relX])(x);
  }

  public pY(y: number) {
    return this.scaleLinear([0, 1], [this.relY, this.relY + this.height])(y);
  }

  public pYRev(y: number) {
    return this.scaleLinear([0, 1], [this.relY + this.height, this.relY])(y);
  }

  private scaleLinear(
    domain: number[],
    range: number[],
  ): (x: number) => number {
    const [x1, x2] = domain;
    const [y1, y2] = range;

    if (x1 === x2) return () => (y2 - y1) / 2;

    return (x: number) => (y1 * (x2 - x) + y2 * (x - x1)) / (x2 - x1);
  }
}
