export class TileSpecs {
  constructor(
    public width: number,
    public height: number,
    public absX: number,
    public absY: number,
    public relX: number,
    public relY: number,
    public innerPadding: number,
    public outerPadding: number,
    public hAlign: 'left' | 'center' | 'right',
    public vAlign: 'top' | 'center' | 'bottom',
  ) {}

  public get aspectRatio(): number {
    if (this.height === 0) throw new Error('Height is zero!');

    return this.width / this.height;
  }

  public copy(): TileSpecs {
    const {
      width,
      height,
      absX,
      absY,
      relX,
      relY,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
    } = this;

    return new TileSpecs(
      width,
      height,
      absX,
      absY,
      relX,
      relY,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
    );
  }
}
