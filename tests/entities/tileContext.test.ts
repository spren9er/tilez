import { beforeEach, expect, describe, it, vi } from 'vitest';

// mock svelte context
let CONTEXT = new Map();
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
  beforeEach(() => {
    CONTEXT = new Map();
  });
  it('creates node context', () => {});
});
