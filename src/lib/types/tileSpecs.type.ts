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

export type TypeTileSpecs = TypeTileSpecsDimension & TypeTileSpecsCoords;
