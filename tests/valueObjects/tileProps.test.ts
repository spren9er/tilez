import { expect, describe, it } from 'vitest';

import {
  TileProps,
  TilePropsDimensionsAccessor,
} from '$lib/valueObjects/tileProps';
import { TilePropsDimensionsFactory } from '$lib/factories/tilePropsDimensionsFactory';

describe('TilePropsDimensionsAccessor', () => {
  it('returns size, unit and value', () => {
    const propsDimensions = new TilePropsDimensionsFactory(10, '20%').build();

    const widthAccessor = new TilePropsDimensionsAccessor(
      propsDimensions,
      'width',
    );
    expect(widthAccessor.size).toEqual(10);
    expect(widthAccessor.unit).toEqual('px');
    expect(widthAccessor.value).toEqual(10);

    const heightAccessor = new TilePropsDimensionsAccessor(
      propsDimensions,
      'height',
    );
    expect(heightAccessor.size).toBeUndefined();
    expect(heightAccessor.unit).toEqual('%');
    expect(heightAccessor.value).toEqual(0.2);
  });
});

const props = new TileProps(
  new TilePropsDimensionsFactory(10, undefined).build(),
  'horizontal',
  'html',
  1,
  2,
  'left',
  'center',
  'sizing',
);

describe('TileProps', () => {
  it('returns width and height', () => {
    expect(props.width).toEqual(10);
    expect(props.height).toBeUndefined();
  });

  it('can be copied', () => {
    const copy = props.copy();

    expect(props.width).toEqual(copy.width);
    expect(props.height).toEqual(copy.height);
    expect(props.stack).toEqual(copy.stack);
    expect(props.type).toEqual(copy.type);
    expect(props.innerPadding).toEqual(copy.innerPadding);
    expect(props.outerPadding).toEqual(copy.outerPadding);
    expect(props.hAlign).toEqual(copy.hAlign);
    expect(props.vAlign).toEqual(copy.vAlign);
    expect(props.mode).toEqual(copy.mode);
  });

  it('can be called dynamically', () => {
    expect(props.call('width')).toEqual(props.width);
    expect(props.call('height')).toEqual(props.height);
    expect(props.call('stack')).toEqual(props.stack);
    expect(props.call('type')).toEqual(props.type);
    expect(props.call('innerPadding')).toEqual(props.innerPadding);
    expect(props.call('outerPadding')).toEqual(props.outerPadding);
    expect(props.call('hAlign')).toEqual(props.hAlign);
    expect(props.call('vAlign')).toEqual(props.vAlign);
    expect(props.call('mode')).toEqual(props.mode);
  });

  it('attribute can be compared with another props attribute', () => {
    const other = new TileProps(
      new TilePropsDimensionsFactory(20, undefined).build(),
      'horizontal',
      'svg',
      undefined,
      4,
      'right',
      'center',
      'spacing',
    );

    expect(props.hasSameValue(other, 'width')).toEqual(false);
    expect(props.hasSameValue(other, 'height')).toEqual(true);
    expect(props.hasSameValue(other, 'stack')).toEqual(true);
    expect(props.hasSameValue(other, 'type')).toEqual(false);
    expect(props.hasSameValue(other, 'innerPadding')).toEqual(false);
    expect(props.hasSameValue(other, 'outerPadding')).toEqual(false);
    expect(props.hasSameValue(other, 'hAlign')).toEqual(false);
    expect(props.hasSameValue(other, 'vAlign')).toEqual(true);
    expect(props.hasSameValue(other, 'mode')).toEqual(false);
  });

  it('can be compared with other props', () => {
    const other = props.copy();
    expect(props.isEqualTo(other)).toEqual(true);

    other.innerPadding = 7;
    expect(props.isEqualTo(other)).toEqual(false);
  });
});
