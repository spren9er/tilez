export type TypeTilePropsDimension = number | string;
export type TypeTilePropsStack = 'horizontal' | 'vertical' | 'none';
export type TypeTilePropsAlign = 'top' | 'bottom' | 'left' | 'right' | 'center';
export type TypeTilePropsType = 'plain' | 'html' | 'svg';

export type TypeTileProps = {
  width?: TypeTilePropsDimension;
  height?: TypeTilePropsDimension;
  stack?: TypeTilePropsStack;
  align?: TypeTilePropsAlign;
  type?: TypeTilePropsType;
  padding?: TypeTilePropsDimension;
};
