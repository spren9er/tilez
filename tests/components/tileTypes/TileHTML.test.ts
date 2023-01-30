import { render } from '@testing-library/svelte';
import { expect, describe, it } from 'vitest';

import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import TileHTML from '$lib/components/tileTypes/TileHTML.svelte';

describe('TileHTML', () => {
  it('renders correctly', () => {
    const width = 1000;
    const height = 1000;

    const node = new TileNodeFactory({ width, height }).build();

    const { container } = render(TileHTML, { props: { node } });

    const tile: HTMLElement = container.querySelector('.tile')!;

    expect(tile.style.top).toEqual('0px');
    expect(tile.style.left).toEqual('0px');
    expect(tile.style.width).toEqual('1000px');
    expect(tile.style.height).toEqual('1000px');
  });
});
