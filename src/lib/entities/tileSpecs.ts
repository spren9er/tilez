type TypeRange = [number, number];

function scaleLinear(
  domain: [number, number],
  range: [number, number],
): (x: number) => number {
  const [x1, x2] = domain;
  const [y1, y2] = range;

  if (x1 === x2) throw new Error('Empty domain is not allowed!');

  if (x1 > x2) return scaleLinear([x2, x1], [range[1], range[0]]);

  return (x: number) => (y1 * (x2 - x) + y2 * (x - x1)) / (x2 - x1);
}

export class TileSpecs {
  private coordsX?: TileSpecsCoords;
  private coordsY?: TileSpecsCoords;

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

  public domainX(domain: [number, number]) {
    this.coordsX = this.specsCoordsX(domain);

    return this;
  }

  public domainY(domain: [number, number]) {
    this.coordsY = this.specsCoordsY(domain);

    return this;
  }

  public x(x: number) {
    if (!this.coordsX) throw Error('No domain for x-axis specified!');

    return this.coordsX.transform(x);
  }

  public y(y: number) {
    if (!this.coordsY) throw Error('No domain for y-axis specified!');

    return this.coordsY.transform(y);
  }

  public px(x: number) {
    return this.specsCoordsX([0, 1]).transform(x);
  }

  public py(y: number) {
    return this.specsCoordsY([0, 1]).transform(y);
  }

  public xinv(x: number) {
    if (!this.coordsX) throw Error('No domain for x-axis specified!');

    return this.coordsX.invTransform(x);
  }

  public yinv(y: number) {
    if (!this.coordsY) throw Error('No domain for y-axis specified!');

    return this.coordsY.invTransform(y);
  }

  public pxinv(x: number) {
    return this.specsCoordsX([0, 1]).invTransform(x);
  }

  public pyinv(y: number) {
    return this.specsCoordsY([0, 1]).invTransform(y);
  }

  private specsCoordsY(domain: [number, number]) {
    const range = [0, this.height] as TypeRange;

    return new TileSpecsCoords(domain, range);
  }

  private specsCoordsX(domain: [number, number]) {
    const range = [0, this.width] as TypeRange;

    return new TileSpecsCoords(domain, range);
  }
}

class TileSpecsCoords {
  constructor(
    private domain: [number, number],
    private range: [number, number],
  ) {}

  public transform(x: number) {
    const linearScale = scaleLinear(this.domain, this.range);

    return linearScale(x);
  }

  public invTransform(y: number) {
    const invLinearScale = scaleLinear(this.range, this.domain);

    return invLinearScale(y);
  }
}
