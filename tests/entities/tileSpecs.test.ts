import { expect, describe, it } from 'vitest';

import { TileSpecs } from '$lib/entities/tileSpecs';

const specs = new TileSpecs(100, 200, 0, 0, 0, 0);

describe('TileSpecs', () => {
  it("can't calculate value if domain has not been set", () => {
    expect(() => specs.x(0)).toThrowError('No domain for x-axis specified!');
    expect(() => specs.xinv(0)).toThrowError('No domain for x-axis specified!');

    expect(() => specs.y(0)).toThrowError('No domain for y-axis specified!');
    expect(() => specs.yinv(0)).toThrowError('No domain for y-axis specified!');
  });

  it("can't calculate using empty domains", () => {
    specs.domainX([0, 0]);

    expect(() => specs.x(0)).toThrowError('Empty domain is not allowed!');
  });

  it('calculates value using x if domain is given where left bound is larger than right bound', () => {
    specs.domainX([10, 0]);

    expect(specs.x(2.5)).toEqual(75);
  });

  it('calculates value using x', () => {
    specs.domainX([0, 10]);

    expect(specs.x(5)).toEqual(50);
  });

  it('calculates value using y', () => {
    specs.domainY([5, 15]);

    expect(specs.y(7.5)).toEqual(50);
  });

  it('calculates value using px', () => {
    expect(specs.px(0.5)).toEqual(50);
  });

  it('calculates value using py', () => {
    expect(specs.py(0.25)).toEqual(50);
  });

  it('calculates inverse value using xinv', () => {
    specs.domainX([0, 10]);

    expect(specs.xinv(50)).toEqual(5);
  });

  it('calculates inverse value using yinv', () => {
    specs.domainY([5, 15]);

    expect(specs.yinv(50)).toEqual(7.5);
  });

  it('calculates inverse value using pxinv', () => {
    expect(specs.pxinv(50)).toEqual(0.5);
  });

  it('calculates inverse value using pyinv', () => {
    expect(specs.pyinv(50)).toEqual(0.25);
  });
});
