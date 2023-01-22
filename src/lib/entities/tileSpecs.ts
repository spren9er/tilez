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
    public type: 'plain' | 'html' | 'svg' | 'canvas',
    public mode: 'spacing' | 'sizing',
    public stack?: 'horizontal' | 'vertical',
  ) {}

  public get aspectRatio(): number {
    if (this.height === 0) throw new Error('Height is zero!');

    return this.width / this.height;
  }

  public get hasEmptySize(): boolean {
    return this.width === 0 || this.height === 0;
  }

  public updateCoordsAndDimensions(
    width: number,
    height: number,
    rootX: number,
    rootY: number,
    subRootX: number,
    subRootY: number,
    parentX: number,
    parentY: number,
  ) {
    this.width = width;
    this.height = height;
    this.rootX = rootX;
    this.rootY = rootY;
    this.subRootX = subRootX;
    this.subRootY = subRootY;
    this.parentX = parentX;
    this.parentY = parentY;
  }

  public merge(other: TileSpecs): TileSpecs {
    return new TileSpecs(
      other.width || this.width,
      other.height || this.height,
      other.rootX || this.rootX,
      other.rootY || this.rootY,
      other.subRootX || this.subRootX,
      other.subRootY || this.subRootY,
      other.parentX || this.parentX,
      other.parentY || this.parentY,
      other.innerPadding,
      other.outerPadding,
      other.hAlign,
      other.vAlign,
      other.type,
      other.mode,
      other.stack,
    );
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
      type,
      mode,
      stack,
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
      type,
      mode,
      stack,
    );
  }
}
