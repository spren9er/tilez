<script lang="ts">
	import type { TypeTilePropsMode } from '$lib/types/tileProps.type';

	import { Tile, HTile, VTile } from '$lib';

	import TileHTMLBox from '$examples/boxes/TileHTMLBox.svelte';
	import TileSVGBox from '$examples/boxes/TileSVGBox.svelte';
	import TileCanvasBox from '$examples/boxes/TileCanvasBox.svelte';

	let width = 200;
	let height = 200;
	let innerPadding = 4;
	let outerPadding = 4;
	let mode: TypeTilePropsMode = 'spacing';
</script>

<h1>tilez</h1>

<form>
	<div class="width">
		<label for="width">width</label>
		<input type="range" min={100} max={600} bind:value={width} />
		<div class="value">{width}px</div>
	</div>
	<div class="height">
		<label for="height">height</label>
		<input type="range" min={20} max={600} bind:value={height} />
		<div class="value">{height}px</div>
	</div>
	<div class="innerPadding">
		<label for="innerPadding">inner padding</label>
		<input type="range" min={0} max={20} bind:value={innerPadding} />
		<div class="value">{innerPadding}px</div>
	</div>
	<div class="outerPadding">
		<label for="outerPadding">outer padding</label>
		<input type="range" min={0} max={20} bind:value={outerPadding} />
		<div class="value">{outerPadding}px</div>
	</div>
	<div class="mode">
		<label for="mode">mode</label>
		<select name="mode" bind:value={mode}>
			<option value="spacing">spacing</option>
			<option value="sizing">sizing</option>
		</select>
	</div>
</form>

<div class="tile-types">
	<div class="tile-type">
		<h3>HTML</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="html">
				<VTile>
					<Tile height="60%">
						<TileHTMLBox />
					</Tile>
					<Tile width="50px" height="50px" hAlign="center">
						<TileHTMLBox />
					</Tile>
					<Tile>
						<TileHTMLBox />
					</Tile>
				</VTile>
				<VTile width="50%">
					<HTile height="50px">
						<Tile width="70%">
							<TileHTMLBox />
						</Tile>
						<Tile>
							<TileHTMLBox />
						</Tile>
					</HTile>
					<Tile width="70px" hAlign="right">
						<TileHTMLBox />
					</Tile>
					<Tile height="120px" vAlign="bottom">
						<TileHTMLBox />
					</Tile>
				</VTile>
				<Tile>
					<TileHTMLBox />
				</Tile>
			</HTile>
		</div>
	</div>

	<div class="tile-type">
		<h3>SVG</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="svg">
				<VTile>
					<Tile width="60%">
						<TileSVGBox />
					</Tile>
					<Tile>
						<TileSVGBox />
					</Tile>
					<Tile width="50px" height="50px">
						<TileSVGBox />
					</Tile>
				</VTile>
				<Tile>
					<TileSVGBox />
				</Tile>
				<Tile>
					<TileSVGBox />
				</Tile>
			</HTile>
		</div>
	</div>

	<div class="tile-type">
		<h3>Canvas</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="canvas">
				<VTile>
					<Tile width="60%">
						<TileCanvasBox />
					</Tile>
					<Tile>
						<TileCanvasBox />
					</Tile>
					<Tile width="50px" height="50px">
						<TileCanvasBox />
					</Tile>
				</VTile>
				<Tile>
					<TileCanvasBox />
				</Tile>
				<Tile>
					<TileCanvasBox />
				</Tile>
			</HTile>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Courier New', Courier, monospace;
		font-size: 12px;
		color: #333333;
		background-color: #efefef;
	}

	h1 {
		margin: 20px 10px;
	}

	form div {
		height: 25px;
		display: flex;
		align-items: center;
	}

	label {
		text-align: right;
		padding-right: 8px;
		display: inline-block;
		width: 100px;
	}

	div.value {
		padding-left: 6px;
		width: 50px;
	}

	.tile-types {
		display: flex;
		justify-content: flex-start;
	}

	.tile-type {
		margin: 10px;
		padding: 10px;
		border: 1px solid #333333;
		background-color: #ffffff;
	}

	.tile-type h3 {
		margin: 0px 0px 2px 0px;
	}

	.root-tile {
		border: 1px solid #aaaaaa;
	}
</style>
