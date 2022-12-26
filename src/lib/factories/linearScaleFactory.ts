import { LinearScale } from '$lib/utils/linearScale';

export class LinearScaleFactory {
  private _domain?: [number, number];
  private _range?: [number, number];

  constructor(domain?: [number, number], range?: [number, number]) {
    this._domain = domain || [0, 1];
    this._range = range || [0, 1];
  }

  public domain([x1, x2]: [number, number]) {
    this._domain = [x1, x2];
  }

  public range([x1, x2]: [number, number]) {
    this._range = [x1, x2];
  }

  public build(): LinearScale {
    return new LinearScale(this._domain, this._range);
  }
}
export function linearScale(domain: [number, number], range: [number, number]) {
  const [x1, x2] = domain;
  const [y1, y2] = range;

  if (x1 === x2) throw new Error('Empty domain is not allowed!');

  if (x1 > x2) return new LinearScale([x2, x1], [y1, y2]);

  new LinearScale([x1, x2], [y1, y2]);
}
