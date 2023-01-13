export class TileSpecs {
  constructor(
    public width: number,
    public height: number,
    public rootX: number,
    public rootY: number,
    public subRootX: number,
    public subRootY: number,
    public parentX: number,
    public parentY: number,
    public innerPadding: number,
    public outerPadding: number,
    public hAlign: 'left' | 'center' | 'right',
    public vAlign: 'top' | 'center' | 'bottom',
  ) {}

  public get aspectRatio(): number {
    if (this.height === 0) throw new Error('Height is zero!');

    return this.width / this.height;
  }

  public get hasEmptySize(): boolean {
    return this.width === 0 || this.height === 0;
  }

  public copy(): TileSpecs {
    const {
      width,
      height,
      rootX,
      rootY,
      subRootX,
      subRootY,
      parentX,
      parentY,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
    } = this;

    return new TileSpecs(
      width,
      height,
      rootX,
      rootY,
      subRootX,
      subRootY,
      parentX,
      parentY,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
    );
  }
}
