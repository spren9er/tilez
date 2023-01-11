export type TypeTileSpecsDimension = {
  width: number;
  height: number;
};

export type TypeTileSpecsCoords = {
  rootX: number;
  rootY: number;
  parentX: number;
  parentY: number;
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
