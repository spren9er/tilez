![Tests](https://github.com/spren9er/tilez/actions/workflows/test.yml/badge.svg)
![Coverage](https://img.shields.io/badge/Coverage-100%25-success?logo=vitest&logoColor=959da5&labelColor=2b3138&style=flat)

# ![Logo](https://github.com/spren9er/tilez/blob/main/static/tilez.svg?raw=true) tilez

The original idea of **_tilez_** was to build an abstraction layer for creating compositions of arbitrary SVG charts in Svelte, where the result is a single SVG file. However, it is not limited to this use case. By default, all tiles – the building blocks of a layout – are renderless components. You define your layout via nested stackable tiles, where each tile has its own coordinate space, which is then accessible via Svelte stores (within a tile's context).

_**tilez**_ is

- easy-to-use (declare your layout in a simple manner)
- flexible (can be used as SVG, HTML or renderless components)
- reactive (all tiles adapt to changes of root tile)
- free of dependencies (except for Svelte)
- opinionated (the way the layout algorithm works, especially when not enough space is available, see [here](#how-does-the-layout-algorithm-work))
- robust (handles edge cases very well)
- light-weight (does not add more than a few KB to your application)

## Installation

Install **_tilez_** as npm package via

```
npm install tilez
```


## How to specify layouts?

A **Tile** component is a building block of a layout.
By defining props of nested tiles, you define the whole layout within an arbitrary rectangular area in a declarative way.

### Tile Layouts

Here is an example of a simple layout

```html
<Tile stack="horizontal" width="800px" height="600px">
  <Tile width="400px">
    <SomeComponent />
  </Tile>
  <Tile>
    <AnotherComponent />
  </Tile>
  <Tile height="300px" vAlign="center">
    <YetAnotherComponent />
  </Tile>
</Tile>
```

### Tile Component

A **Tile** component has the following available props

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
  <SomeComponent />
</Tile>
```

However, there is one exception: the root (most outer) tile must have an absolute width and height!

### Stacking Tiles

The main concept of _**tilez**_ is that you can stack tiles in _horizontal_ or _vertical_ direction, recursively.
Within a stack, a tile starts where the last tile ends. For stacking you use the property [stack](#stack) which defines in which direction children tiles should be stacked.

For convenience  there are shortcuts available

- **HTile** for _horizontal_ stacking
- **VTile** for _vertical_ stacking

These components have the same props available as basic **Tile** component (except for [stack](#stack) property).


### Tile Props

A **Tile** has the following props:

<a name="stack" href="#stack">#</a> tilez.Tile.<b>stack</b>

When this property is not given, all children tiles will have the same coordinate space like current tile.
Otherwise, children tiles will be distributed within current tile according to their props in _horizontal_ or _vertical_ direction.


<a name="width" href="#width">#</a> tilez.Tile.<b>width</b>

Argument can be an absolute or relative number. Accepts strings like _"500px"_, _"500"_, _"50%"_, _"0.5"_ or numbers like _500_ or _0.5_. Numbers less than 1 are interpreted as percentages, otherwise they represent absolute widths.
The given width will result in different tile widths, depending on the layout [mode](#mode).
When there is no width given (default), available space in parent tile will be distributed equally between current tile and other tiles having no width specification.


<a name="height" href="#height">#</a> tilez.Tile.<b>height</b>

Analogue to [width](#width) above.


<a name="inner_padding" href="#inner_padding">#</a> tilez.Tile.<b>innerPadding</b> · [default: 0 / inherits]

Defines the padding **between** children tiles of current tile. Format must be either a string like _"10px"_, _"10"_ or a number like _10_. Relative values are not supported.
For layout mode _'spacing'_ it adds half of the given inner padding to the left and right of the outer tiles (or tile if there is only one).
This property will be inherited, thus all children tiles will have the same inner padding unless not specified explicitly in children tile. If inner padding of children tile is given, this value will be considered instead of inner padding of parent tile.


<a name="outer_padding" href="#outer_padding">#</a> tilez.Tile.<b>outerPadding</b> · [default: 0]

Defines the padding **around** children tile(s) of current tile. It is similar to CSS padding of a HTML container.
This property won't be inherited.


<a name="h_align" href="#h_align">#</a> tilez.Tile.<b>hAlign</b> · (_'left'_ | _'center'_ | _'right'_) [default: _'left'_]

Defines the horizontal alignment w.r.t. parent tile. Accepts _'left'_, _'center'_ and _'right'_.
When several children tiles share the same alignment property, they will be positioned as a group according to their given order within parent tile. For _'center'_ applies: If centered group can't be positioned in the center because there will be an overlap with _'left'_ or _'right'_ groups, it will be shifted to the right or left, respectively.


<a name="v_align" href="#v_align">#</a> tilez.Tile.<b>vAlign</b> · (_'top'_ |  _'center'_ | _'bottom'_) [default: _'top'_]

Defines the vertical alignment w.r.t. parent tile. Accepts _'top'_, _'center'_ and _'bottom'_.
It behaves like [hAlign](#h_align), but in vertical direction.


<a name="type" href="#type">#</a> tilez.Tile.<b>type</b> · (_'plain'_ | _'svg'_ |  _'html'_ ) [default: _'plain'_] [inherits]

By default, using **_tilez_** won't create any HTML containers. All components are renderless components.
Available types are _'plain'_, _'svg'_ and _'html'_. Using an _'svg'_ layout, parent tile will be an SVG container and all children tiles will be rendered as SVG group. This property inherits from parent tile unless not specified explicitly.
Otherwise, given type will be taken into consideration.
You could use **_tilez_** as _'html'_ layout engine (all containers are implicitly absolute positioned), but in that case CSS flexbox and CSS grid are more powerful and flexible.
Note, that an _'html'_ tile can't be embedded into an _'svg'_ tile.


<a name="mode" href="#mode">#</a> tilez.Tile.<b>mode</b> · (_'spacing'_ | _'sizing'_ ) [default: _'spacing'_] [inherits]

There are two layout modes available: one which is optimized for _'spacing'_ and one for _'sizing'_. They differ on how to interpret sizes when you specify a non-zero inner padding. When no inner padding is given, both modes produce the same layout.

#### Tile Layout Mode _Spacing_

In layout mode _'spacing'_ (default mode), inner padding is part of the size specification of a tile. For a given width of 100px and an inner padding of 20px, the resulting width of the tile is 80px. On each side of a tile, there is a gap of 50% of inner padding, in our example 10px. The consequence is that in this layout spacings are aligned properly, e.g. the first gap of a tile with 50% width is aligned with the second gap of two tiles of 25% width each.

Note, that there will be empty space of 50% inner padding on all sides of the most outer tile. If you want equidistant paddings throughout the whole tile hierarchy, you can add an outer padding in parent tile of inner padding / 2.

When you use absolute sizes together with relative sizes to define your layout, make sure to add outer padding to your size beforehand. As an example: You want to work with a width of 200px and outer padding is given as 10px. Then a tile of width 100px corresponds to a tile of 50% only when the initial width is defined as 220px, **not** 200px.

#### Tile Layout Mode _Sizing_

When layout mode _'sizing'_ is used, all tiles have exactly the size which is specified in tile props, i.e. for a given width of 100px, the tile has exactly a width of 100px (when there is enough space to render). Also, a tile of width 50% has twice the width of a tile of width 25%, which generally does not apply to _'spacing'_ layout mode.

It depends on your use case, which mode you choose. You can also mix modes, start with one mode and change to the other mode in an inner tile.


## How to access tile specs?

Now, after defining your layout, you embed your components in your tiles, exactly in the tile where you want to place them. In your component you get access to tile specs and linear scales of local coordinate system by adding the following lines:

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

The **TileSpecs** class has following properties:

| property     | description                                                                         |
| ------------ | ----------------------------------------------------------------------------------- |
| width        | width of tile                                                                       |
| height       | height of tile                                                                      |
| absX         | absolute x-coordinate (w.r.t. root tile)                                            |
| absY         | absolute y-coordinate (w.r.t. root tile)                                            |
| relX         | relative x-coordinate (w.r.t. parent tile)                                          |
| relY         | relative y-coordinate (w.r.t. parent tile)                                          |
| innerPadding | padding between children tiles                                                      |
| outerPadding | padding around children tiles                                                       |
| hAlign       | horizontal alignment (w.r.t. parent tile) [one of  _'left'_, _'center'_, _'right'_] |
| vAlign       | vertical alignment (w.r.t. parent tile) [one of _'top'_, _'center'_, _'bottom'_]    |

### Linear Scales

For each tile, there are two linear scales `$xScale` and `$yScale` available, one for x-axis and one for y-axis.
Their domain is `[0, 1]` and their range is `[0, $specs.width]` or `[0, $specs.height]`, respectively.
You can modify the domain for each scale.

```js
import { getTileContext } from 'tilez';

const { xScale, yScale } = getTileContext();

$: x = $xScale.domain([-5, 5]);
$: y = $yScale.domain([0, 400]);

$: console.log([x(0.5), y(150)]);
```

Both scales are directly callable using `()`.
Domains are also supported, where upper bound is less than lower bound, e.g. using `[1, 0]` will map `0` to full size and `1` to `0`.

Note: If you need more powerful, non-linear scales, consider using _d3-scale_ with given tile [specs](#specs).


## How does the layout algorithm work?

The underlying layout algorithm should behave well in all circumstances, also when there is not enough space to render all given tiles.

But which tiles should be rendered and which should be ignored?

We take a closer look at the following opinionated rendering algorithm which is implemented in _**tilez**_:

### Tiles Priorization

For rendering, we consider one tile with a non-trivial stack direction (_'horizontal'_ or _'vertical'_) and  its direct children tiles. This algorithm then can be applied to each stack of the tiles hierarchy.

Before tiles are rendered within a stack, they are sorted according to the following order:

1. Tiles of absolute sizes
2. Tiles of relative sizes
3. Tiles of flex sizes (no size specification)

Within each group, tiles are sorted according to the natural order given (ascending order of children tiles within parent tile).
The order gives information about the priority for rendering. First tiles of above order have high priority and will be rendered first, while last tiles won't be rendered at all, if there is not enough space left.

_**Note:** Alignment props are **not** taken into consideration when sorting!
Thus, tile _B_ which comes **after** tile _A_ in natural order and belongs to same group, could be aligned as such that it appears **before** tile _A_. This fact can be used to take influence in the rendering behavior._

### Layout Algorithm

1. We take one tile after the other of first sorted group above (tiles of absolute sizes) and for each tile we determine its size, as long as enough space is available. A tile which doesn't fit completely in available space is cut off. Then, rest of tiles will have zero size.
2. If sizes of all tiles of first group are determined and there is still space left, the available space will be distributed between all remaining tiles in the following way:
   1. Filter out tiles of relative size which can't be rendered, because their calculated size is less than 1px (or 1px + _inner padding_ for _'spacing'_ layout).
   2. For all remaining tiles of second group (tiles of relative sizes), we will process tiles like in step 1: Resulting sizes will be determined one by one. If there is not enough space available, tile will be cut off and all remaining tiles will have zero size.
   3. If sizes of all tiles of relative sizes are determined and there is still space left, we consider the last group of tiles (flex tiles w/o size specification). Let's assume there are _n_ flex tiles left. Their size will be calculated by distributing remaining space equally across flex tiles (each flex tile will have same size). If sizes are less than 1px or 1px + _inner padding_, respectively, we try to distribute remaining space across n-1 flex tiles, then n-2 flex tiles, and so on. Finally, we either have some flex tiles with large enough sizes to render or all flex tiles will have zero size.

So far, we only computed the resulting size for each tile.
Now, we consider the rendering algorithm. When all sizes are determined with the process above, tiles are grouped according to their alignment w.r.t. stack direction (_'hAlign'_ for _'horizontal'_ and _'vAlign'_ for _'vertical'_).
This will generate three groups. We process them in the following way:

1. Render all tiles of _'left'_ or _'top'_ group according to their natural order from left to right or top to bottom.
2. Render all tiles of _'right'_ or _'bottom'_ group according to their natural order (here descending) from right to left or bottom to top.
3. Render all tiles of _'center'_ group according to their natural order in the middle of parent tile. If there is an  overlap with tiles from first or last group, we shift the center group to the right or left (this group then won't appear in the center).

In each step above, zero-sized tiles are ignored.
