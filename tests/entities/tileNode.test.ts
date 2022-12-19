import { expect, describe, it } from 'vitest';

import { TileNode } from '$lib/entities/tileNode';
import { TileNodeFactory } from '$lib/factories/tileNodeFactory';
import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

describe('TileNode', () => {
  it('has children or not', () => {
    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);

    expect(node.hasChildren).toEqual(false);

    new TileNodeFactory({}, node).build();

    expect(node.hasChildren).toEqual(true);
  });

  it('can access children specs', () => {
    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);

    new TileNodeFactory({}, node).build();

    expect(node.childrenProps).toEqual([props]);
  });

  it('is root or not', () => {
    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);

    expect(node.isRoot).toEqual(true);

    new TileNode(props, node);

    expect(node.isRoot).toEqual(true);
  });

  it('can access specs width and height and updates children specs)', () => {
    const width = 462;
    const height = 926;

    const root = new TileNodeFactory({ width, height }).build();
    expect(root.width).toEqual(width);
    expect(root.height).toEqual(height);

    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);
    expect(node.width).toBeUndefined();
    expect(node.height).toBeUndefined();

    const child = new TileNode(props, root);
    expect(child.width).toEqual(width);
    expect(child.height).toEqual(height);
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

  it('derives type from parent unless specified', () => {
    const parentType = 'svg';

    const props = new TilePropsFactory({ type: parentType }).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory({}, node).build();

    expect(child.props.type).toEqual(parentType);
  });

  it('overrides type from parent', () => {
    const childType = 'svg';

    const props = new TilePropsFactory({ type: 'html' }).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory({ type: childType }, node).build();

    expect(child.props.type).toEqual(childType);
  });

  it('has no type when not specified in parent and itself', () => {
    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory({}, node).build();

    expect(child.props.type).toBeUndefined();
  });

  it('derives inner padding from parent unless specified', () => {
    const parentInnerPadding = 10;

    const props = new TilePropsFactory({
      innerPadding: parentInnerPadding,
    }).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory({}, node).build();

    expect(child.props.innerPadding).toEqual(parentInnerPadding);
  });

  it('overrides inner padding from parent when given explicitly', () => {
    const childInnerPadding = 5;

    const props = new TilePropsFactory({ innerPadding: 10 }).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory(
      { innerPadding: childInnerPadding },
      node,
    ).build();

    expect(child.props.innerPadding).toEqual(childInnerPadding);
  });

  it('has no inner padding when not specified in parent and itself', () => {
    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory({}, node).build();

    expect(child.props.innerPadding).toBeUndefined();
  });

  it('does not inherit props "outerPadding", "hAlign", "vAlign" from parent', () => {
    const props = new TilePropsFactory({
      outerPadding: 10,
      hAlign: 'left',
      vAlign: 'bottom',
    }).build();
    const node = new TileNode(props);
    const child = new TileNodeFactory({}, node).build();

    expect(child.props.outerPadding).toBeUndefined();
    expect(child.props.hAlign).toBeUndefined();
    expect(child.props.vAlign).toBeUndefined();
  });

  it('updates specs when specs given', () => {
    const width = 861;
    const height = 687;
    const newWidth = 462;
    const newHeight = 926;

    const node = new TileNodeFactory({ width, height }).build();

    expect(node.width).toEqual(width);
    expect(node.height).toEqual(height);

    node.updateSpecs(newWidth, newHeight);

    expect(node.width).toEqual(newWidth);
    expect(node.height).toEqual(newHeight);
  });

  it('acts as no-op when updating specs, but specs not given', () => {
    const newWidth = 462;
    const newHeight = 926;

    const props = new TilePropsFactory({}).build();
    const node = new TileNode(props);

    expect(node.specs).toBeUndefined();

    node.updateSpecs(newWidth, newHeight);

    expect(node.specs).toBeUndefined();
  });

  it('acts as no-op when updating specs, but new specs are not absolute', () => {
    const width = 861;
    const height = 687;
    const newWidth = '20%';
    const newHeight = '10%';

    const node = new TileNodeFactory({ width, height }).build();

    expect(node.width).toEqual(width);
    expect(node.height).toEqual(height);

    node.updateSpecs(newWidth, newHeight);

    expect(node.width).toEqual(width);
    expect(node.height).toEqual(height);
  });
});
