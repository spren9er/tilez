export class TilePropsDimension {
  constructor(
    public type: 'width' | 'height',
    public value: number,
    public unit: 'px' | '%',
  ) {}

  public compare(propsDimension: TilePropsDimension) {
    if (this.type !== propsDimension.type)
      throw new Error("Can't compare dimensions of different types!");

    if (this.unit === propsDimension.unit) return 0;

    return this.unit > propsDimension.unit ? 1 : -1;
  }
}
