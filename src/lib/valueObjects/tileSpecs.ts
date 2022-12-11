import { scaleLinear } from 'd3-scale';

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
    return scaleLinear([0, this.width], [this.relX, this.relX + this.width])(x);
  }

  public xRev(x: number) {
    return scaleLinear([0, this.width], [this.relX + this.width, this.relX])(x);
  }

  public y(y: number) {
    return scaleLinear(
      [0, this.height],
      [this.relY, this.relY + this.height],
    )(y);
  }

  public yRev(y: number) {
    return scaleLinear(
      [0, this.height],
      [this.relY + this.height, this.relY],
    )(y);
  }

  public pX(x: number) {
    return scaleLinear([0, 1], [this.relX, this.relX + this.width])(x);
  }

  public pXRev(x: number) {
    return scaleLinear([0, 1], [this.relX + this.width, this.relX])(x);
  }

  public pY(y: number) {
    return scaleLinear([0, 1], [this.relY, this.relY + this.height])(y);
  }

  public pYRev(y: number) {
    return scaleLinear([0, 1], [this.relY + this.height, this.relY])(y);
  }
}
