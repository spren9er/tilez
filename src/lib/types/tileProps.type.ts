export type TypeTilePropsDimension = number | string;
export type TypeTilePropsStack = 'horizontal' | 'vertical';
export type TypeTilePropsType = 'plain' | 'html' | 'svg';
export type TypeTilePropsHAlign = 'left' | 'center' | 'right';
export type TypeTilePropsVAlign = 'top' | 'center' | 'bottom';
export type TypeTilePropsAlign = TypeTilePropsHAlign | TypeTilePropsVAlign;
export type TypeTilePropsMode = 'spacing' | 'sizing';

export type TypeTileProps = {
  width?: TypeTilePropsDimension;
  height?: TypeTilePropsDimension;
  stack?: TypeTilePropsStack;
  type?: TypeTilePropsType;
  innerPadding?: TypeTilePropsDimension;
  outerPadding?: TypeTilePropsDimension;
  hAlign?: TypeTilePropsHAlign;
  vAlign?: TypeTilePropsVAlign;
  mode?: TypeTilePropsMode;
};
