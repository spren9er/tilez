import { expect, describe, it } from 'vitest';

import type {
  TypeTilePropsStack,
  TypeTilePropsType,
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
  TypeTilePropsMode,
} from '$lib/types/tileProps.type';

import { TilePropsFactory } from '$lib/factories/tilePropsFactory';

describe('TilePropsFactory', () => {
  it('passes through "stack", "mode" and "align" props', () => {
    const stack = 'horizontal';
    const hAlign = 'center';
    const vAlign = 'center';
    const mode = 'spacing';
    const props = new TilePropsFactory({ stack, hAlign, vAlign, mode }).build();

    expect(props.stack).toEqual(stack);
    expect(props.hAlign).toEqual(hAlign);
    expect(props.vAlign).toEqual(vAlign);
    expect(props.mode).toEqual(mode);
  });

  it('validates prop "stack"', () => {
    ['horizontal', 'vertical'].forEach((stack: string) => {
      const props = new TilePropsFactory({
        stack: stack as TypeTilePropsStack,
      }).build();

      expect(props.stack).toEqual(stack);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.stack).toBeUndefined();

    expect(() => {
      new TilePropsFactory({ stack: 'diagonal' as TypeTilePropsStack }).build();
    }).toThrowError(
      'Tile prop "stack" must be one of "horizontal" or "vertical"!',
    );
  });

  it('validates prop "type"', () => {
    ['plain', 'html', 'svg', 'canvas', 'webgl'].forEach((type: string) => {
      const props = new TilePropsFactory({
        type: type as TypeTilePropsType,
      }).build();

      expect(props.type).toEqual(type);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.type).toBeUndefined();

    expect(() => {
      new TilePropsFactory({ type: 'webgpu' as TypeTilePropsType }).build();
    }).toThrowError(
      'Tile prop "type" must be one of "plain", "html", "svg", "canvas", "webgl"!',
    );
  });

  it('parses prop "innerPadding" when given as string', () => {
    const props = new TilePropsFactory({ innerPadding: '2px' }).build();

    expect(props.innerPadding).toEqual(2);
  });

  it('keeps trivial "innerPadding" undefined', () => {
    const props = new TilePropsFactory({}).build();

    expect(props.innerPadding).toBeUndefined();
  });

  it('parses prop "outerPadding" when given as string', () => {
    const props = new TilePropsFactory({ outerPadding: '2px' }).build();

    expect(props.outerPadding).toEqual(2);
  });

  it('keeps trivial "outerPadding" undefined', () => {
    const props = new TilePropsFactory({}).build();

    expect(props.innerPadding).toBeUndefined();
  });

  it('validates prop "hAlign"', () => {
    ['left', 'center', 'right'].forEach((hAlign: string) => {
      const props = new TilePropsFactory({
        hAlign: hAlign as TypeTilePropsHAlign,
      }).build();

      expect(props.hAlign).toEqual(hAlign);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.hAlign).toBeUndefined();

    expect(() => {
      new TilePropsFactory({ hAlign: 'middle' as TypeTilePropsHAlign }).build();
    }).toThrowError(
      'Tile prop "hAlign" must be one of "left", "center", "right"!',
    );
  });

  it('validates prop "vAlign"', () => {
    ['top', 'center', 'bottom'].forEach((vAlign: string) => {
      const props = new TilePropsFactory({
        vAlign: vAlign as TypeTilePropsVAlign,
      }).build();

      expect(props.vAlign).toEqual(vAlign);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.vAlign).toBeUndefined();

    expect(() => {
      new TilePropsFactory({
        vAlign: 'middle' as TypeTilePropsVAlign,
      }).build();
    }).toThrowError(
      'Tile prop "vAlign" must be one of "top", "center", "bottom"!',
    );
  });

  it('validates prop "mode"', () => {
    ['spacing', 'sizing'].forEach((mode: string) => {
      const props = new TilePropsFactory({
        mode: mode as TypeTilePropsMode,
      }).build();

      expect(props.mode).toEqual(mode);
    });

    const props = new TilePropsFactory({}).build();

    expect(props.mode).toBeUndefined();

    expect(() => {
      new TilePropsFactory({ mode: 'fit' as TypeTilePropsMode }).build();
    }).toThrowError('Tile prop "mode" must be one of "spacing" or "sizing"!');
  });
});
