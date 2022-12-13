import { expect, describe, it } from 'vitest';

import { TileNode } from '$lib/entities/tileNode';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

describe('TileNode', () => {
  it('has children or not', () => {
    const props = new TilePropsFactory({}).build();

    const node = new TileNode(props);
    expect(node.hasChildren).toEqual(false);

    new TileNode(props, node);
    expect(node.hasChildren).toEqual(true);
  });

  it('is root or not', () => {
    const props = new TilePropsFactory({}).build();

    const node = new TileNode(props);
    expect(node.isRoot).toEqual(true);

    new TileNode(props, node);
    expect(node.isRoot).toEqual(true);
  });

  it('can access specs width and height', () => {
    const width = 462;
    const height = 926;

    const props = new TilePropsFactory({}).build();
    const anotherNode = new TileNode(props);
    expect(anotherNode.width).toBeUndefined();
    expect(anotherNode.height).toBeUndefined();

    const node = new TileNodeFactory({ width, height }).build();
    expect(node.width).toEqual(width);
    expect(node.height).toEqual(height);
  });

  it('can access children specs', () => {
    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);

    new TileNode(props, node);

    expect(node.childrenProps).toEqual([props]);
  });

  it('of type "html" can\'t  be embedded into "svg"', () => {
    const props = new TilePropsFactory({ type: 'svg' }).build();
    const node = new TileNode(props);

    const htmlProps = new TilePropsFactory({ type: 'html' }).build();
    expect(() => new TileNode(htmlProps, node)).toThrowError(
      "SVG tile can't be embedded into a non-SVG tile!",
    );

    const plainProps = new TilePropsFactory({ type: 'plain' }).build();
    expect(() => new TileNode(plainProps, node)).toThrowError(
      "SVG tile can't be embedded into a non-SVG tile!",
    );
  });
});
