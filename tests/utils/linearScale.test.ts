import { expect, describe, it } from 'vitest';

import { LinearScale } from '$lib/utils/linearScale';

describe('LinearScale', () => {
  it('creates linear scale with default domain [0, 1] and range [0, 1]', () => {
    const scale = new LinearScale();

    expect(scale(0)).toEqual(0);
    expect(scale(1)).toEqual(1);
  });

  it('can set domain and range during initialization', () => {
    const scale = new LinearScale([1, 2], [3, 4]);

    expect(scale(1)).toEqual(3);
    expect(scale(2)).toEqual(4);
  });

  it('can set domain after initialization', () => {
    const scale = new LinearScale();

    scale.domain([1, 2]);

    expect(scale(1)).toEqual(0);
    expect(scale(2)).toEqual(1);
  });

  it('can set range after initialization', () => {
    const scale = new LinearScale();

    scale.range([1, 2]);

    expect(scale(0)).toEqual(1);
    expect(scale(1)).toEqual(2);
  });

  it('is not created when domain is empty', () => {
    expect(() => new LinearScale([1, 1])).toThrowError(
      'Empty domain is not allowed!',
    );
  });

  it('does not set domain when domain is empty', () => {
    expect(() => new LinearScale().domain([1, 1])).toThrowError(
      'Empty domain is not allowed!',
    );
  });

  it('works for domains where upper bound is less than lower bound', () => {
    const scale = new LinearScale([2, 1], [3, 4]);

    expect(scale(1)).toEqual(4);
    expect(scale(2)).toEqual(3);
  });
});
