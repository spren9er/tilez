import { render } from '@testing-library/svelte';
import { expect, describe, it } from 'vitest';

import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import TileSVG from '$lib/components/tileTypes/TileSVG.svelte';

describe('TileSVG', () => {
  it('renders correctly', () => {
    const width = 1000;
    const height = 1000;

    const node = new TileNodeFactory({ width, height }).build();

    const { container } = render(TileSVG, { props: { node } });

    const tile: SVGElement = container.querySelector('svg')!;

    expect(tile.getAttribute('width')).toEqual('1000');
    expect(tile.getAttribute('height')).toEqual('1000');
  });
});
