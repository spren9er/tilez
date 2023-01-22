import type {
  TypeTilePropsHAlign,
  TypeTilePropsVAlign,
  TypeTilePropsType,
  TypeTilePropsMode,
} from '$lib/types/tileProps.type';
import type { TileProps } from '$lib/valueObjects/tileProps';

import { TileSpecs } from '$lib/entities/tileSpecs';

export class TileSpecsFactory {
  DEFAULT_SPECS = {
    width: 0,
    height: 0,
    rootX: 0,
    rootY: 0,
    subRootX: 0,
    subRootY: 0,
    parentX: 0,
    parentY: 0,
    innerPadding: 0,
    outerPadding: 0,
    hAlign: 'left' as TypeTilePropsHAlign,
    vAlign: 'top' as TypeTilePropsVAlign,
    type: 'plain' as TypeTilePropsType,
    mode: 'spacing' as TypeTilePropsMode,
    stack: undefined,
  };

  constructor(private props: TileProps, private parentSpecs?: TileSpecs) {}

  public build() {
    let { width, height } = this.DEFAULT_SPECS;
    let innerPadding: number;
    let type: TypeTilePropsType;
    let mode: TypeTilePropsMode;

    this.validateTypeDerivation();

    if (this.parentSpecs) {
      innerPadding = this.props.innerPadding ?? this.parentSpecs.innerPadding;
      type = this.props.type || this.parentSpecs.type;
      mode = this.props.mode || this.parentSpecs.mode;
    } else {
      const units = ['width', 'height'].map(
        (dim) => this.props.dim(dim as 'width' | 'height').unit,
      );
      if (units.includes('%'))
        throw new Error('Relative dimensions are not allowed in root tile!');

      innerPadding = this.props.innerPadding ?? this.DEFAULT_SPECS.innerPadding;
      type = this.props.type || this.DEFAULT_SPECS.type;
      mode = this.props.mode || this.DEFAULT_SPECS.mode;
      width = this.props.width ?? this.DEFAULT_SPECS.width;
      height = this.props.height ?? this.DEFAULT_SPECS.height;
    }

    const outerPadding =
      this.props.outerPadding ?? this.DEFAULT_SPECS.outerPadding;
    const hAlign = this.props.hAlign || this.DEFAULT_SPECS.hAlign;
    const vAlign = this.props.vAlign || this.DEFAULT_SPECS.vAlign;
    const stack = this.props.stack || this.DEFAULT_SPECS.stack;

    const { rootX, rootY, subRootX, subRootY, parentX, parentY } =
      this.DEFAULT_SPECS;

    return new TileSpecs(
      width,
      height,
      rootX,
      rootY,
      subRootX,
      subRootY,
      parentX,
      parentY,
      innerPadding,
      outerPadding,
      hAlign,
      vAlign,
      type,
      mode,
      stack,
    );
  }

  private validateTypeDerivation() {
    if (!this.parentSpecs) return;

    const type = this.props.type;
    if (!type) return;

    const typeMapping = {
      plain: 'Plain',
      html: 'HTML',
      svg: 'SVG',
      canvas: 'Canvas',
    };

    if (this.parentSpecs.type === 'svg') {
      if (['html', 'canvas'].includes(type))
        throw Error(
          `${typeMapping[type]} tile can't be embedded into SVG tile!`,
        );
    }

    if (this.parentSpecs.type === 'canvas') {
      if (['html', 'svg'].includes(type))
        throw Error(
          `${typeMapping[type]} tile can't be embedded into Canvas tile!`,
        );
    }
  }
}
