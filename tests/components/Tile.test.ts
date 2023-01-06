import { render } from '@testing-library/svelte';
import { expect, describe, it } from 'vitest';

import Tile from '$lib/components/Tile.svelte';

describe('Tile', () => {
  it('of "plain" type renders nothing but a wrapper', () => {
    const { container } = render(Tile, { props: { width: 100, height: 100 } });

    const tileWrapper = container.querySelector('#tile-wrapper');

    expect(tileWrapper).toBeInTheDocument();
    expect(tileWrapper?.children).toHaveLength(0);
  });

  it('of "svg" type renders a <svg>', () => {
    const { container } = render(Tile, {
      props: { width: 100, height: 100, type: 'svg' },
    });

    const tileWrapper = container.querySelector('#tile-wrapper');
    const element = tileWrapper?.firstChild;

    expect(element).toBeInstanceOf(SVGElement);
  });

  it('of "html" type renders a <div>', () => {
    const { container } = render(Tile, {
      props: { width: 100, height: 100, type: 'html' },
    });

    const tileWrapper = container.querySelector('#tile-wrapper');
    const element = tileWrapper?.firstChild;

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toHaveClass('tile');
  });
});
