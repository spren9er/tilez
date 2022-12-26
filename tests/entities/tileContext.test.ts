import { expect, describe, it, vi } from 'vitest';

import { get } from 'svelte/store';

import { getTileContext, setNodeContext } from '$lib/entities/tileContext';

// mock svelte context
const CONTEXT = new Map();
vi.mock('svelte', () => ({
  getContext(key: string) {
    return CONTEXT.get(key);
  },
  setContext(key: string, value: unknown) {
    CONTEXT.set(key, value);
  },
  hasContext(key: string) {
    return CONTEXT.has(key);
  },
}));

describe('TileContext', () => {
  it('creates node/specs contexts and retrieve specs and scales of context', () => {
    const width = 200;
    const height = 100;
    setNodeContext({ width, height });

    const { specs, xScale, yScale } = getTileContext();

    expect(get(specs).width).toEqual(width);
    expect(get(specs).height).toEqual(height);

    expect(get(xScale)(1)).toEqual(width);
    expect(get(yScale)(1)).toEqual(height);
  });
});
