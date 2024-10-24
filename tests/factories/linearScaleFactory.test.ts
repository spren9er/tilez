import { expect, describe, it } from 'vitest';

import { LinearScaleFactory } from '$lib/factories/linearScaleFactory';

describe('LinearScaleFactory', () => {
  it('builds linear scale (using no arguments)', () => {
    const linearScale = new LinearScaleFactory().build();

    expect(linearScale.call(0)).toEqual(0);
    expect(linearScale.call(0.5)).toEqual(0.5);
    expect(linearScale.call(1)).toEqual(1);
  });

  it('builds linear scale (using domain and range in constructor)', () => {
    const linearScale = new LinearScaleFactory([-5, 5], [0, 10]).build();

    expect(linearScale.call(-5)).toEqual(0);
    expect(linearScale.call(0)).toEqual(5);
    expect(linearScale.call(5)).toEqual(10);
  });

  it('builds linear scale (using domain and range methods)', () => {
    const linearScaleFactory = new LinearScaleFactory();

    linearScaleFactory.domain([-5, 5]);
    const linearScale1 = linearScaleFactory.build();
    expect(linearScale1.call(5)).toEqual(1);

    linearScaleFactory.range([0, 10]);
    const linearScale2 = linearScaleFactory.build();
    expect(linearScale2.call(5)).toEqual(10);
  });
});
