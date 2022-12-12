import { expect, describe, it } from 'vitest';

import type {
  TypeTilePropsStack,
  TypeTilePropsAlign,
  TypeTilePropsType,
} from '$lib/types/tileProps.type';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

describe('TilePropsFactory', () => {
  it('passes through "stack" and "align" props', () => {
    const stack = 'horizontal';
    const align = 'center';
    const props = new TilePropsFactory({ stack, align }).build();

    expect(props.stack).toEqual(stack);
    expect(props.align).toEqual(align);
  });

  it('validates prop "stack"', () => {
    ['horizontal', 'vertical', 'none'].forEach((stack: string) => {
      const props = new TilePropsFactory({
        stack: stack as TypeTilePropsStack,
      }).build();

      expect(props.stack).toEqual(stack);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.stack).toEqual('none');

    expect(() => {
      new TilePropsFactory({ stack: 'diagonal' as TypeTilePropsStack }).build();
    }).toThrowError(
      'Tile prop "stack" must be one of "horizontal", "vertical", "none"!',
    );
  });

  it('validates prop "align"', () => {
    ['left', 'right', 'top', 'bottom', 'center'].forEach((align: string) => {
      const props = new TilePropsFactory({
        align: align as TypeTilePropsAlign,
      }).build();

      expect(props.align).toEqual(align);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.align).toEqual('center');

    expect(() => {
      new TilePropsFactory({ align: 'middle' as TypeTilePropsAlign }).build();
    }).toThrowError(
      'Tile prop "align" must be one of "left", "right", "top", "bottom", "center"!',
    );
  });

  it('validates prop "type"', () => {
    ['plain', 'html', 'svg'].forEach((type: string) => {
      const props = new TilePropsFactory({
        type: type as TypeTilePropsType,
      }).build();

      expect(props.type).toEqual(type);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.type).toEqual('plain');

    expect(() => {
      new TilePropsFactory({ type: 'webgl' as TypeTilePropsType }).build();
    }).toThrowError('Tile prop "type" must be one of "plain", "html", "svg"!');
  });

  it('parses prop "padding" when given as string', () => {
    const props = new TilePropsFactory({ padding: '2px' }).build();

    expect(props.padding).toEqual(2);
  });

  it('keeps trivial "padding" undefined (needed for inheritance)', () => {
    const props = new TilePropsFactory({}).build();

    expect(props.padding).toBeUndefined();
  });
});
