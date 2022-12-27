class ExtensibleFunction extends Function {
  constructor(func: string) {
    super(func);

    /* c8 ignore next */
    return Object.setPrototypeOf(func, new.target.prototype);
  }
}

export class LinearScale extends ExtensibleFunction {
  constructor(
    private _domain?: [number, number],
    private _range?: [number, number],
  ) {
    const scale = (x: number) => {
      return this.call(x);
    };
    super(scale as unknown as string);

    this._domain = _domain || [0, 1];
    this._range = _range || [0, 1];

    this.validateDomain();
  }

  public call(x: number): number {
    const [x1, x2] = this._domain!;
    const [y1, y2] = this._range!;

    return (y1 * (x2 - x) + y2 * (x - x1)) / (x2 - x1);
  }

  public domain([x1, x2]: [number, number]) {
    this._domain = [x1, x2];
    this.validateDomain();

    return this;
  }

  public range([x1, x2]: [number, number]) {
    this._range = [x1, x2];

    return this;
  }

  private validateDomain() {
    const [x1, x2] = this._domain!;

    if (x1 === x2) throw new Error('Empty domain is not allowed!');
  }
}
