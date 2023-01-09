import { render } from '@testing-library/svelte';
import { expect, describe, it } from 'vitest';

import Tile from '$lib/components/Tile.svelte';
import EmptyTwoLevelHierarchy from '$fixtures/EmptyTwoLevelHierarchy.svelte';

function getElementFrom(container: HTMLElement, level = 0) {
  const tileWrapper = container.querySelector('#tile-wrapper');
  let child = tileWrapper;

  while (level > 0) {
    child = child ? child.children[0] : null;

    level--;
  }

  return child;
}

describe('Tile', () => {
  it('of "plain" type renders nothing but a wrapper', () => {
    const { container } = render(Tile, { props: { width: 100, height: 100 } });

    const tileWrapper = getElementFrom(container);

    expect(tileWrapper).toBeInTheDocument();
    expect(
      Array.from(tileWrapper!.children).filter(
        (child) => child.tagName !== 'IFRAME', // bind:client... is using iframe
      ),
    ).toHaveLength(0);
  });

  it('renders if no width and height is given', () => {
    const { container } = render(Tile, { props: { type: 'html' } });

    const element = getElementFrom(container, 1);

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element?.tagName).toEqual('DIV');
  });

  it('of "svg" type renders a <svg> if root', () => {
    const { container } = render(Tile, {
      props: { width: 100, height: 100, type: 'svg' },
    });

    const element = getElementFrom(container, 1);

    expect(element).toBeInstanceOf(SVGElement);
    expect(element?.tagName).toEqual('svg');
  });

  it('of "svg" type renders a <g> unless root', () => {
    const { container } = render(EmptyTwoLevelHierarchy, {
      props: { type: 'svg' },
    });

    const element = getElementFrom(container, 2);

    expect(element).toBeInstanceOf(SVGElement);
    expect(element?.tagName).toEqual('g');
  });

  it('of "html" type renders a <div>', () => {
    const { container } = render(Tile, {
      props: { width: 100, height: 100, type: 'html' },
    });

    const element = getElementFrom(container, 1);

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toHaveClass('tile');
    expect(element?.tagName).toEqual('DIV');
  });

  it('of "plain" type exposes trivial element via binding', () => {
    const { component } = render(EmptyTwoLevelHierarchy, {
      props: { type: 'plain' },
    });

    const outerElement = component.getOuterElement();

    expect(outerElement).toBeUndefined();

    const innerElement = component.getInnerElement();

    expect(innerElement).toBeUndefined();
  });

  it('of "svg" type exposes element via binding', () => {
    const { component } = render(EmptyTwoLevelHierarchy, {
      props: { type: 'svg' },
    });

    const outerElement = component.getOuterElement();

    expect(outerElement).toBeInstanceOf(SVGElement);
    expect(outerElement?.tagName).toEqual('svg');

    const innerElement = component.getInnerElement();

    expect(innerElement).toBeInstanceOf(SVGElement);
    expect(innerElement?.tagName).toEqual('g');
  });

  it('of "html" type exposes element via binding', () => {
    const { component } = render(EmptyTwoLevelHierarchy, {
      props: { type: 'html' },
    });

    const outerElement = component.getOuterElement();

    expect(outerElement).toBeInstanceOf(HTMLElement);

    const innerElement = component.getInnerElement();

    expect(innerElement).toBeInstanceOf(HTMLElement);
  });
});
