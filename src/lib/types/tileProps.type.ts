export type TypeTilePropsDimension = number | string;
export type TypeTilePropsStack = 'horizontal' | 'vertical';
export type TypeTilePropsType = 'plain' | 'html' | 'svg' | 'canvas' | 'webgl';
export type TypeTilePropsHAlign = 'left' | 'center' | 'right';
export type TypeTilePropsVAlign = 'top' | 'center' | 'bottom';
export type TypeTilePropsAlign = TypeTilePropsHAlign | TypeTilePropsVAlign;
export type TypeTilePropsMode = 'spacing' | 'sizing';
export type TypeTilePropsElement = HTMLElement | SVGElement | HTMLCanvasElement;
export type TypeTilePropsWrapper = HTMLDivElement;
export type TypeTilePropsContext =
  | CanvasRenderingContext2D
  | WebGLRenderingContext
  | null;

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
