<script lang="ts">
	import type {
		TypeTilePropsVAlign,
		TypeTilePropsMode,
	} from '$lib/types/tileProps.type';

	import { Tile, HTile, VTile } from '$lib';

	import TileHTMLBox from '$examples/boxes/TileHTMLBox.svelte';
	import TileSVGBox from '$examples/boxes/TileSVGBox.svelte';
	import TileCanvasBox from '$examples/boxes/TileCanvasBox.svelte';

	let width = 200;
	let height = 200;
	let innerPadding = 4;
	let outerPadding = 4;
	let mode: TypeTilePropsMode = 'spacing';

	let subWidthActivated = false;
	let subHeightActivated = false;
	let subInnerPaddingActivated = false;
	let subModeActivated = false;

	let subWidth = 50;
	let subHeight = 100;
	let subInnerPadding = 4;
	let subOuterPadding = 0;
	let subVAlign: TypeTilePropsVAlign = 'top';

	$: subWidthResult = subWidthActivated ? `${subWidth}%` : undefined;
	$: subHeightResult = subHeightActivated ? `${subHeight}%` : undefined;
	$: subInnerPaddingResult = subInnerPaddingActivated
		? subInnerPadding
		: undefined;
	$: subModeResult = subModeActivated
		? mode === 'sizing'
			? 'spacing'
			: 'sizing'
		: mode;
</script>

<h1>tilez</h1>

<div class="forms">
	<div class="form">
		<h3>Root Tile</h3>

		<form>
			<div>
				<label for="width">width</label>
				<input type="range" min={100} max={800} bind:value={width} />
				<div class="value">{width}px</div>
			</div>
			<div>
				<label for="height">height</label>
				<input type="range" min={20} max={600} bind:value={height} />
				<div class="value">{height}px</div>
			</div>
			<div>
				<label for="innerPadding">inner padding</label>
				<input type="range" min={0} max={20} bind:value={innerPadding} />
				<div class="value">{innerPadding}px</div>
			</div>
			<div>
				<label for="outerPadding">outer padding</label>
				<input type="range" min={0} max={20} bind:value={outerPadding} />
				<div class="value">{outerPadding}px</div>
			</div>
			<div>
				<label for="mode">mode</label>
				<select name="mode" bind:value={mode}>
					<option value="spacing">spacing</option>
					<option value="sizing">sizing</option>
				</select>
			</div>
		</form>
	</div>

	<div class="form">
		<h3>Sample Sub Root Tile</h3>

		<form>
			<div>
				<label for="width">width</label>
				<input type="checkbox" bind:checked={subWidthActivated} />
				<input
					type="range"
					min={0}
					max={100}
					bind:value={subWidth}
					disabled={!subWidthActivated}
				/>
				<div class="value">{subWidth}%</div>
			</div>
			<div>
				<label for="height">height</label>
				<input type="checkbox" bind:checked={subHeightActivated} />
				<input
					type="range"
					min={0}
					max={100}
					bind:value={subHeight}
					disabled={!subHeightActivated}
				/>
				<div class="value">{subHeight}%</div>
			</div>
			<div>
				<label for="innerPadding">inner padding</label>
				<input type="checkbox" bind:checked={subInnerPaddingActivated} />
				<input
					type="range"
					min={0}
					max={20}
					bind:value={subInnerPadding}
					disabled={!subInnerPaddingActivated}
				/>
				<div class="value">{subInnerPadding}px</div>
			</div>
			<div>
				<label for="outerPadding">outer padding</label>
				<input type="checkbox" style:visibility="hidden" />
				<input type="range" min={0} max={20} bind:value={subOuterPadding} />
				<div class="value">{subOuterPadding}px</div>
			</div>
			<div>
				<label for="mode">change mode</label>
				<input type="checkbox" bind:checked={subModeActivated} />
				<select name="mode" bind:value={subModeResult} disabled={true}>
					<option value="spacing">spacing</option>
					<option value="sizing">sizing</option>
				</select>
			</div>
			<div>
				<label for="vAlign">vAlign</label>
				<select
					name="vAlign"
					bind:value={subVAlign}
					disabled={!subHeightActivated ||
						(subHeightActivated && subHeight === 100)}
				>
					<option value="top">top</option>
					<option value="center">center</option>
					<option value="bottom">bottom</option>
				</select>
			</div>
		</form>
	</div>
</div>

<div class="tile-types">
	<div class="tile-type">
		<h3>HTML</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="html">
				<VTile
					width={subWidthResult}
					height={subHeightResult}
					innerPadding={subInnerPaddingResult}
					outerPadding={subOuterPadding}
					mode={subModeResult}
					vAlign={subVAlign}
				>
					<Tile height="15%">
						<TileHTMLBox />
					</Tile>
					<HTile>
						<Tile width="70px">
							<TileHTMLBox />
						</Tile>
						<Tile>
							<TileHTMLBox />
						</Tile>
					</HTile>
					<HTile height="70px">
						<Tile width="30%">
							<TileHTMLBox />
						</Tile>
						<Tile width="60%" hAlign="right">
							<TileHTMLBox />
						</Tile>
					</HTile>
					<Tile height="20%">
						<TileHTMLBox />
					</Tile>
				</VTile>
				<VTile>
					<HTile height="40%" vAlign="top">
						<VTile width="75%">
							<Tile>
								<TileHTMLBox />
							</Tile>
							<Tile height="30%">
								<TileHTMLBox />
							</Tile>
						</VTile>
						<Tile>
							<TileHTMLBox />
						</Tile>
					</HTile>
					<Tile width="80%" hAlign="right">
						<TileHTMLBox />
					</Tile>
					<HTile height="30%" vAlign="bottom">
						<Tile>
							<TileHTMLBox />
						</Tile>
						<Tile width="50px">
							<TileHTMLBox />
						</Tile>
					</HTile>
				</VTile>
			</HTile>
		</div>
	</div>

	<div class="tile-type">
		<h3>SVG</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="svg">
				<VTile
					width={subWidthResult}
					height={subHeightResult}
					innerPadding={subInnerPaddingResult}
					outerPadding={subOuterPadding}
					mode={subModeResult}
					vAlign={subVAlign}
				>
					<Tile height="15%">
						<TileSVGBox />
					</Tile>
					<HTile>
						<Tile width="70px">
							<TileSVGBox />
						</Tile>
						<Tile>
							<TileSVGBox />
						</Tile>
					</HTile>
					<HTile height="70px">
						<Tile width="30%">
							<TileSVGBox />
						</Tile>
						<Tile width="60%" hAlign="right">
							<TileSVGBox />
						</Tile>
					</HTile>
					<Tile height="20%">
						<TileSVGBox />
					</Tile>
				</VTile>
				<VTile>
					<HTile height="40%" vAlign="top">
						<VTile width="75%">
							<Tile>
								<TileSVGBox />
							</Tile>
							<Tile height="30%">
								<TileSVGBox />
							</Tile>
						</VTile>
						<Tile>
							<TileSVGBox />
						</Tile>
					</HTile>
					<Tile width="80%" hAlign="right">
						<TileSVGBox />
					</Tile>
					<HTile height="30%" vAlign="bottom">
						<Tile>
							<TileSVGBox />
						</Tile>
						<Tile width="50px">
							<TileSVGBox />
						</Tile>
					</HTile>
				</VTile>
			</HTile>
		</div>
	</div>

	<div class="tile-type">
		<h3>Canvas</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="canvas">
				<VTile
					width={subWidthResult}
					height={subHeightResult}
					innerPadding={subInnerPaddingResult}
					outerPadding={subOuterPadding}
					mode={subModeResult}
					vAlign={subVAlign}
				>
					<Tile height="15%">
						<TileCanvasBox />
					</Tile>
					<HTile>
						<Tile width="70px">
							<TileCanvasBox />
						</Tile>
						<Tile>
							<TileCanvasBox />
						</Tile>
					</HTile>
					<HTile height="70px">
						<Tile width="30%">
							<TileCanvasBox />
						</Tile>
						<Tile width="60%" hAlign="right">
							<TileCanvasBox />
						</Tile>
					</HTile>
					<Tile height="20%">
						<TileCanvasBox />
					</Tile>
				</VTile>
				<VTile>
					<HTile height="40%" vAlign="top">
						<VTile width="75%">
							<Tile>
								<TileCanvasBox />
							</Tile>
							<Tile height="30%">
								<TileCanvasBox />
							</Tile>
						</VTile>
						<Tile>
							<TileCanvasBox />
						</Tile>
					</HTile>
					<Tile width="80%" hAlign="right">
						<TileCanvasBox />
					</Tile>
					<HTile height="30%" vAlign="bottom">
						<Tile>
							<TileCanvasBox />
						</Tile>
						<Tile width="50px">
							<TileCanvasBox />
						</Tile>
					</HTile>
				</VTile>
			</HTile>
		</div>
	</div>

	<div class="tile-type">
		<h3>Mixed</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="plain">
				<VTile
					width={subWidthResult}
					height={subHeightResult}
					innerPadding={subInnerPaddingResult}
					outerPadding={subOuterPadding}
					mode={subModeResult}
					vAlign={subVAlign}
				>
					<Tile height="15%" type="canvas">
						<TileCanvasBox />
					</Tile>
					<HTile type="html">
						<Tile width="70px">
							<TileHTMLBox />
						</Tile>
						<Tile>
							<TileHTMLBox />
						</Tile>
					</HTile>
					<HTile height="70px">
						<Tile width="30%" type="svg">
							<TileSVGBox />
						</Tile>
						<Tile width="60%" hAlign="right" type="html">
							<TileHTMLBox />
						</Tile>
					</HTile>
					<Tile height="20%" type="svg">
						<TileSVGBox />
					</Tile>
				</VTile>
				<VTile>
					<HTile height="40%" vAlign="top">
						<VTile width="75%" type="html">
							<Tile>
								<TileHTMLBox />
							</Tile>
							<Tile height="30%">
								<TileHTMLBox />
							</Tile>
						</VTile>
						<Tile type="canvas">
							<TileCanvasBox />
						</Tile>
					</HTile>
					<Tile width="80%" hAlign="right" type="canvas">
						<TileCanvasBox />
					</Tile>
					<HTile height="30%" vAlign="bottom" type="svg">
						<Tile>
							<TileSVGBox />
						</Tile>
						<Tile width="50px">
							<TileSVGBox />
						</Tile>
					</HTile>
				</VTile>
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
		margin: 50px;
	}

	h1 {
		text-align: center;
		margin: 20px 10px;
	}

	.forms {
		display: flex;
		justify-content: center;
		margin: 20px 0px;
	}

	.form {
		margin: 0px 20px;
	}

	.form h3 {
		text-align: center;
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
		justify-content: center;
		flex-wrap: wrap;
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
