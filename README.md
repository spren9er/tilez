![Tests](https://github.com/spren9er/tilez/actions/workflows/test.yml/badge.svg)
![Coverage](https://img.shields.io/badge/Coverage-100%25-success?logo=vitest&logoColor=959da5&labelColor=2b3138&style=flat)

# ![Logo](https://github.com/spren9er/tilez/blob/main/static/tilez.svg?raw=true) tilez

The original idea of **_tilez_** was to build an abstraction layer for creating compositions of arbitrary SVG charts in Svelte, where the result is a single SVG file. However, it is not limited to this use case. By default, all tiles – the building blocks of a layout – are renderless components. You define your layout via nested stackable tiles, where each tile has its own coordinate space, which is then accessible via a Svelte store (within a tile's context).

_**tilez**_ is

- easy-to-use (declare your layout in a simple manner)
- flexible (can be used as SVG, HTML or renderless components)
- reactive (all tiles adapt to changes of root tile)
- free of dependencies (except for Svelte)
- opinionated (the way the layout algorithm works, especially when not enough space is available, see [here](#how-does-the-layout-algorithm-work))
- robust (handles edge cases very well)
- light-weight (does not add more than a few KB to your code base)

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
Note that an _'html'_ tile can't be embedded into an _'svg'_ tile.


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

Now, after defining your layout, you embed your components in your tiles, exactly where you want to place them.
In your component you retrieve access to tile specs and linear scales of local coordinate system by adding the following lines:

```js
import { getTileContext } from 'tilez';

const {specs, xScale, yScale } = getTileContext();
```

All three objects – which you obtain from a tile's context – are Svelte stores.

Alternatively, you can use `getContext` from Svelte. The name of the context is simply _'tilez'_.

<a name="get_tile_context" href="#get_tile_context">#</a> tilez.<b>getTileContext()</b>

Returns an object containing three Svelte stores [specs](#specs), [xScale](#x_scale) and [yScale](#y_scale), which are described below.

<a name="specs" href="#specs">#</a> tilez.<b>TileSpecs</b>

TBD

## How does the layout algorithm work?

TBD