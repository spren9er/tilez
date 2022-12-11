import { expect, describe, it } from 'vitest';

import { TilePropsDimension } from '$lib/valueObjects/tilePropsDimension';

describe('TilePropsDimension', () => {
  it('calculates size from %', () => {
    const propsDimension = new TilePropsDimension('width', 0.9, '%');
    expect(propsDimension.value).toEqual(0.9);
  });

  it('calculates size from px unit', () => {
    const propsDimension = new TilePropsDimension('width', 90, 'px');
    expect(propsDimension.value).toEqual(90);
  });

  it("can't be compared with another props dimension of different type", () => {
    const propsDimensionA = new TilePropsDimension('width', 100, 'px');
    const propsDimensionB = new TilePropsDimension('height', 100, 'px');

    expect(() => propsDimensionA.compare(propsDimensionB)).toThrowError(
      "Can't compare dimensions of different types!",
    );
  });

  it('can be compared with another props dimension with same px unit', () => {
    const propsDimensionA = new TilePropsDimension('width', 100, 'px');
    const propsDimensionB = new TilePropsDimension('width', 100, 'px');

    expect(propsDimensionA.compare(propsDimensionB)).toEqual(0);

    propsDimensionB.value = 90;
    expect(propsDimensionA.compare(propsDimensionB)).toEqual(0);

    propsDimensionB.value = 110;
    expect(propsDimensionA.compare(propsDimensionB)).toEqual(0);
  });

  it('can be compared with another props dimension with same %', () => {
    const propsDimensionA = new TilePropsDimension('width', 0.5, '%');
    const propsDimensionB = new TilePropsDimension('width', 0.5, '%');

    expect(propsDimensionA.compare(propsDimensionB)).toEqual(0);

    propsDimensionB.value = 0.25;
    expect(propsDimensionA.compare(propsDimensionB)).toEqual(0);

    propsDimensionB.value = 0.75;
    expect(propsDimensionA.compare(propsDimensionB)).toEqual(0);
  });

  it('can be compared with another props dimension of different unit', () => {
    const propsDimensionA = new TilePropsDimension('width', 100, 'px');
    const propsDimensionB = new TilePropsDimension('width', 100, '%');

    expect(propsDimensionA.compare(propsDimensionB)).toEqual(1);
    expect(propsDimensionB.compare(propsDimensionA)).toEqual(-1);
  });
});
