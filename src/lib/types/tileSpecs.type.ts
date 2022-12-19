export type TypeTileSpecsDimension = {
  width: number;
  height: number;
};

export type TypeTileSpecsCoords = {
  absX: number;
  absY: number;
  relX: number;
  relY: number;
};

export type TypeTileSpecsFormat = {
  innerPadding: number;
  outerPadding: number;
  hAlign: 'left' | 'center' | 'right';
  vAlign: 'top' | 'center' | 'bottom';
};

export type TypeTileSpecs = TypeTileSpecsDimension &
  TypeTileSpecsCoords &
  TypeTileSpecsFormat;
