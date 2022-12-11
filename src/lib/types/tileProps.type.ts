export type TypeTilePropsStack = 'horizontal' | 'vertical';
export type TypeTilePropsDimension = number | string;
export type TypeTilePropsAlign = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type TypeTileProps = {
  stack?: TypeTilePropsStack;
  width?: TypeTilePropsDimension;
  height?: TypeTilePropsDimension;
  padding?: TypeTilePropsDimension;
  align?: TypeTilePropsAlign;
};
