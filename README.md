![Tests-Badge](https://github.com/spren9er/tilez/actions/workflows/test.yml/badge.svg)
![Coverage-Badge](https://img.shields.io/badge/Coverage-100%25-success?logo=vitest&logoColor=959da5&labelColor=2b3138&style=flat)

# ![Tilez-Logo](https://github.com/spren9er/tilez/blob/main/static/tilez_logo.svg?raw=true) tilez

**_tilez_** is a layout engine for Svelte components.

![Layout-Demo-Animation](https://github.com/spren9er/tilez/blob/main/static/tilez_example.gif?raw=true)

By default, all tiles – the building blocks of a layout – are renderless components. Layout is defined via nested, stackable tiles, where each tile has its own coordinate space, which is accessible through Svelte stores within a tile's context.

_**tilez**_ is

- easy-to-use — _declare your layout in a simple manner_
- flexible — _can be used with SVG, HTML or renderless components_
- reactive — _all tiles adapt to changes of root tile_
- free of dependencies — _except for Svelte_
- opinionated — _the way the layout algorithm works, see [here](#how-does-the-layout-algorithm-work)_
- robust — _handles edge cases very well_
- light-weight — _does not add more than a few KB to your Svelte application_


The original idea of **_tilez_** was to build an abstraction layer for creating compositions of arbitrary SVG charts in Svelte, where the result is a single SVG file.

Here is an example of a composition of several different _Observable Plot_ charts, which makes up an [UpSet plot](https://upset.app). Charts are embedded in a simple **tilez** layout.

![SVG-Demo](https://github.com/spren9er/tilez/blob/main/static/tilez_upset.svg?raw=true)

## Installation

Install **_tilez_** as npm package via

```
npm install tilez
```


## How to specify layouts?

### Tile Component

A **Tile** component is a building block of a layout and has following available props

```html
<Tile
  stack="horizontal"
  width="800px"
  height="600px"
  innerPadding="5px"
  outerPadding="5px"
  hAlign="left"
  vAlign="center"
  type="svg"
  mode="sizing"
>
  ...
</Tile>
```

All props are optional, i.e. you can have tiles with no props at all

```html
<Tile>
  ...
</Tile>
```

However, there is one exception: the root (most outer) tile must have an absolute width and height!

### Stacking Tiles

The main concept of _**tilez**_ is that you can stack tiles in _horizontal_ or _vertical_ direction, recursively.
Within a stack, a tile starts at the point where the last tile ends. For stacking you use the property [stack](#stack), which defines in which direction children tiles should be stacked.

For convenience there are shortcuts available

- **HTile** for _horizontal_ stacking
- **VTile** for _vertical_ stacking

These components have the same props available as a basic **Tile** component (except for [stack](#stack) property).

### Tile Layouts

The layout can be described in a declarative way, by defining props of nested tiles. Here is an example of a simple layout

```html
<HTile width="400px" height="300px" innerPadding="10px" outerPadding="5px">
  <Tile width="200px">
    <Component1 />
  </Tile>
  <Tile height="150px" vAlign="center">
    <Component2 />
  </Tile>
  <Tile>
    <Component3 />
  </Tile>
</HTile>
```

![Example](https://github.com/spren9er/tilez/blob/main/static/tilez_example.png?raw=true)

### Tile Props

A **Tile** has following props

<a name="stack" href="#stack">#</a> tilez.<b>Tile</b>.<i>stack</i>

When this property is not given, all children tiles will have the same coordinate space like current tile.
Otherwise, children tiles will be distributed within current tile according to their props in _horizontal_ or _vertical_ direction.

<a name="width" href="#width">#</a> tilez.<b>Tile</b>.<i>width</i>

Argument can be an absolute or relative number. Accepts strings like _"500px"_, _"500"_, _"50%"_, _"0.5"_ or numbers like _500_ or _0.5_. Numbers less than _1_ are interpreted as percentages, otherwise they represent absolute widths.
The given width will result in different tile widths, depending on the layout [mode](#mode).
When there is no width given (default), remaining space in parent tile — after rendering tiles with absolute and relative width — will be distributed equally between current tile and other tiles having no width specification.

<a name="height" href="#height">#</a> tilez.<b>Tile</b>.<i>height</i>

Analogue to [width](#width) above.

<a name="inner_padding" href="#inner_padding">#</a> tilez.<b>Tile</b>.<i>innerPadding</i> · [default: 0 / inherits]

Defines the padding **between** children tiles of current tile. Format must be either a string like _"10px"_, _"10"_ or a number like _10_. Relative values are not supported.
For layout mode _'spacing'_ it adds half of the given inner padding to the left and right of the outer tiles (or tile if there is only one).
This property will be inherited, thus all children tiles will have the same inner padding for their children unless not specified explicitly in children tile. In other words, if inner padding of children tile is given, this value will be considered instead of inner padding of parent tile.

<a name="outer_padding" href="#outer_padding">#</a> tilez.<b>Tile</b>.<i>outerPadding</i> · [default: 0]

Defines the padding **around** children tile(s) of current tile. It is similar to CSS padding of a HTML container.
This property won't be inherited.

<a name="h_align" href="#h_align">#</a> tilez.<b>Tile</b>.<i>hAlign</i> · (_'left'_ | _'center'_ | _'right'_) [default: _'left'_]

Defines the horizontal alignment w.r.t. parent tile. Accepts _'left'_, _'center'_ and _'right'_.
When several children tiles share the same alignment property, they will be positioned as a group according to their given order within parent tile. For _'center'_ applies: If centered group can't be positioned in the center because there will be an overlap with _'left'_ or _'right'_ groups, it will be shifted to the right or left, respectively.

<a name="v_align" href="#v_align">#</a> tilez.<b>Tile</b>.<i>vAlign</i> · (_'top'_ |  _'center'_ | _'bottom'_) [default: _'top'_]

Defines the vertical alignment w.r.t. parent tile. Accepts _'top'_, _'center'_ and _'bottom'_.
It behaves like [hAlign](#h_align), but in vertical direction.

<a name="type" href="#type">#</a> tilez.<b>Tile</b>.<i>type</i> · (_'plain'_ | _'svg'_ |  _'html'_ ) [default: _'plain'_] [inherits]

By default, using **_tilez_** won't create any HTML containers, i.e. all components are renderless components (_type_ is _'plain'_).
Available types are _'plain'_, _'svg'_ and _'html'_. Using an _'svg'_ layout, parent tile will be an SVG container and all children tiles will be rendered as SVG group. This property inherits from parent tile unless not specified explicitly.
Otherwise, given type will be taken into consideration.
You could use **_tilez_** as _'html'_ layout engine (all containers are implicitly absolute positioned), but in that case CSS flexbox and CSS grid are more powerful and flexible.
Note, that an _'html'_ tile can't be embedded into an _'svg'_ tile.

<a name="mode" href="#mode">#</a> tilez.<b>Tile</b>.<i>mode</i> · (_'spacing'_ | _'sizing'_ ) [default: _'spacing'_] [inherits]

There are two layout modes available: one which is optimized for _'spacing'_ and one for _'sizing'_. They differ on how to interpret sizes when you specify a non-zero inner padding. When no inner padding is given, both modes produce the same layout.

#### Tile Layout Mode _Spacing_

In layout mode _'spacing'_ (default mode), inner padding is part of the size specification of a tile. For a given width of _100px_ and an inner padding of _20px_, the resulting width of the tile is _80px_. On each side of a tile, there is an empty space of _50% of inner padding_, in our example _10px_. The consequence is that in this layout spacings are aligned properly across stacks, e.g. the first gap of a tile with _50%_ width is aligned with the fifth gap of five stacked tiles of _10%_ width each.

![Layout-Mode-Spacing](https://github.com/spren9er/tilez/blob/main/static/tilez_layout_spacing.png?raw=true)

Note, that there will be empty space of _50% inner padding_ on all sides of the most outer tile. If you want equidistant paddings throughout the whole tile hierarchy, you can add an outer padding in root tile of _inner padding / 2_.

When you use absolute sizes together with relative sizes to define your layout, make sure to add outer padding to your size beforehand. As an example: You want to work with a width of _200px_ and outer padding is given as _10px_. Then a tile of width _100px_ corresponds to a tile of _50%_ only when the initial width is defined as _220px_, not _200px_.

#### Tile Layout Mode _Sizing_

When layout mode _'sizing'_ is used, all tiles have exactly the size which is specified in tile props, i.e. for a given width of _100px_, the tile has exactly a width of _100px_ (when there is enough space to render). Also, a tile of width _50%_ has _5_ times the width of a tile of width _10%_ (if they are in the same stack!), which generally does not apply to _'spacing'_ layout mode.

![Layout-Mode-Sizing](https://github.com/spren9er/tilez/blob/main/static/tilez_layout_sizing.png?raw=true)

It depends on your use case, which mode you choose. You can also mix modes, start with one mode and change to the other mode in an inner tile.


## How to access tile specs?

Now, after defining a layout, arbitrary Svelte components can be embedded in your tiles. In your component you get access to tile specs and linear scales of local coordinate system by adding the following lines

```js
import { getTileContext } from 'tilez';

const {specs, xScale, yScale } = getTileContext();
```

All three objects – which you obtain from a tile's context – are Svelte stores.

Alternatively, you can use `getContext` from Svelte. The name of the context is _'tilez'_.

<a name="get_tile_context" href="#get_tile_context">#</a> tilez.<b>getTileContext()</b>

Returns an object containing three Svelte stores

- [specs](#specs) of class **Writable\<TileSpec\>**
- [xScale](#x_scale) of class **Writable\<LinearScale\>**
- [yScale](#y_scale) of class **Writable\<LinearScale\>**

Classes are described below.

### Tile Specs

The **TileSpecs** class has following properties

| property       | type                                    | description                                |
| -------------- | --------------------------------------- | ------------------------------------------ |
| _width_        | number                                  | width of tile                              |
| _height_       | number                                  | height of tile                             |
| _absX_         | number                                  | absolute x-coordinate (w.r.t. root tile)   |
| _absY_         | number                                  | absolute y-coordinate (w.r.t. root tile)   |
| _relX_         | number                                  | relative x-coordinate (w.r.t. parent tile) |
| _relY_         | number                                  | relative y-coordinate (w.r.t. parent tile) |
| _innerPadding_ | number                                  | padding between children tiles             |
| _outerPadding_ | number                                  | padding around children tiles              |
| _hAlign_       | one of  _'left'_, _'center'_, _'right'_ | horizontal alignment (w.r.t. parent tile)  |
| _vAlign_       | one of _'top'_, _'center'_, _'bottom'_  | vertical alignment (w.r.t. parent tile)    |

### Linear Scale

For each tile, there are two linear scales `$xScale` and `$yScale` available, one for _x_-axis and one for _y_-axis.
Their domain is `[0, 1]` and their range is `[0, $specs.width]` or `[0, $specs.height]`, respectively.
You can modify the domain for each scale.

```js
import { getTileContext } from 'tilez';

const { xScale, yScale } = getTileContext();

const x = $xScale.domain([-5, 5]);
const y = $yScale.domain([0, 400]);

const sampleCoords = [x(0.5), y(150)];
```

Both scales are directly callable using `()`.
Domains are also supported, where upper bound is less than lower bound, e.g. using `[1, 0]` will map `0` to full size and `1` to `0`.

_**Note:** If you need non-linear scales, consider using _d3-scale_ with given tile [specs](#specs)._


## How does the layout algorithm work?

The underlying layout algorithm should behave well in all circumstances, especially when there is not enough space to render all given tiles.

But which tiles should be rendered and which should be ignored?

In the following, we take a closer look at an opinionated rendering algorithm, which is implemented in _**tilez**_. We consider the algorithm for one tile with a non-trivial stack direction (_'horizontal'_ or _'vertical'_) and its direct children tiles. This algorithm then can be applied to each stack of the tiles hierarchy.

### Tiles Priorization

Before tiles are rendered within a stack, they are sorted according to following order

1. Tiles of absolute sizes
2. Tiles of relative sizes
3. Tiles of flex sizes (no size specification)

Within each group, tiles are sorted according to the natural order given (ascending order of children tiles within parent tile).
The order gives information about the priority for rendering. First tiles of above order have high priority and will be rendered first, while last tiles won't be rendered at all, if there is not enough space left.

_**Note:** Alignment props are **not** taken into consideration when sorting!
Thus, tile _B_ which comes **after** tile _A_ in natural order and belongs to same group, could be aligned as such that it appears **before** tile _A_. This fact can be used to take influence in the rendering behavior._

### Layout Algorithm

1. We take one tile after the other of first sorted group above (tiles of absolute sizes) and for each tile we determine its size, as long as enough space is available. A tile which doesn't fit completely in available space is cut off. Then, rest of tiles will have zero size.
2. For determining other tiles sizes, we have to look at each specific layout mode separately
   1. **Spacing Mode:** If sizes of all tiles of first group are determined and there is still space left, the available space will be distributed between all remaining tiles in the following way
      1. Filter out tiles of relative size which can't be rendered, because their calculated size is less than _1px_.
      2. For all remaining tiles of second group (tiles of relative sizes), we will process tiles like in first step: Resulting sizes will be determined one by one. If there is not enough space available, tile will be cut off and all remaining tiles will have zero size.
      3. If sizes of all tiles of relative sizes are determined and there is still space left, we consider the last group of tiles (flex tiles w/o size specification). Assuming there are _n_ flex tiles left. Their size will be calculated by distributing remaining space equally across flex tiles (each flex tile will have same size). If sizes are less than _1px_, we try to distribute remaining space across _n - 1_ flex tiles, then _n - 2_ flex tiles, and so on. Finally, we either have some flex tiles with large enough sizes to render or all flex tiles will have zero size.
   2. **Sizing Mode:** Let _m_ be the number of tiles with relative and flex sizes. We want to distribute _k <= m_ tiles (with _k_ max.) and start with _k = m_.
      1. We try to determine _k_ tiles with non-zero relative and flex sizes.
      2. We subtract _(k - 1) x inner padding_ from available space.
      3. For remaining space we apply above steps of _'spacing'_ mode. Assuming _p_ tiles of relative size have non-zero size,  then in last step we only check if _n = k - p_ flex tiles can be rendered or not.
      4. If last step is not successful (there aren't _k_ tiles in total which have non-zero size), then we decrement _k_ and repeat steps above. Algorithm stops at the latest when _k = 0_ and all tiles have zero size.

So far, we only computed the resulting size for each tile.
Now, we consider the rendering algorithm. When all sizes are determined with the process above, tiles are grouped according to their alignment w.r.t. stack direction (_'hAlign'_ for _'horizontal'_ and _'vAlign'_ for _'vertical'_).
This will generate three groups. We process them in the following way

1. Render all tiles of _'left'_ or _'top'_ group according to their natural order from left to right or top to bottom.
2. Render all tiles of _'right'_ or _'bottom'_ group according to their natural order (here descending) from right to left or bottom to top.
3. Render all tiles of _'center'_ group according to their natural order in the middle of parent tile. If there is an  overlap with tiles from first or last group, we shift the center group to the right or left (this group then won't appear in the center).

In each step above, zero-sized tiles are ignored.
