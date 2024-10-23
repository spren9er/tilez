<script lang="ts">
	import type {
		TypeTilePropsHAlign,
		TypeTilePropsVAlign,
		TypeTilePropsMode,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';

	import { Tile, HTile, VTile } from '$lib';

	import TileHTMLBox from '$examples/boxes/TileHTMLBox.svelte';
	import TileSVGBox from '$examples/boxes/TileSVGBox.svelte';
	import TileCanvasBox from '$examples/boxes/TileCanvasBox.svelte';
	import TileWebGLBox from '$examples/boxes/TileWebGLBox.svelte';

	const types: TypeTilePropsType[] = ['html', 'svg', 'canvas', 'webgl'];

	const boxFor = (type: TypeTilePropsType) => {
		switch (type) {
			case 'html':
				return TileHTMLBox;
			case 'svg':
				return TileSVGBox;
			case 'canvas':
				return TileCanvasBox;
			case 'webgl':
				return TileWebGLBox;
		}
	};

	let width = $state(200);
	let height = $state(200);
	let innerPadding = $state(4);
	let outerPadding = $state(2);
	let mode: TypeTilePropsMode = $state('spacing');

	let leftWidthActivated = $state(false);
	let leftHeightActivated = $state(false);
	let leftInnerPaddingActivated = $state(false);
	let leftModeActivated = $state(false);

	let leftWidth = $state(50);
	let leftHeight = $state(100);
	let leftInnerPadding = $state(4);
	let leftOuterPadding = $state(0);
	let leftHAlign: TypeTilePropsHAlign = $state('left');
	let leftVAlign: TypeTilePropsVAlign = $state('top');

	let rightWidthActivated = $state(false);
	let rightHeightActivated = $state(false);
	let rightInnerPaddingActivated = $state(false);
	let rightModeActivated = $state(false);

	let rightWidth = $state(50);
	let rightHeight = $state(100);
	let rightInnerPadding = $state(4);
	let rightOuterPadding = $state(0);
	let rightHAlign: TypeTilePropsHAlign = $state('left');
	let rightVAlign: TypeTilePropsVAlign = $state('top');

	let leftWidthResult = $derived(
		leftWidthActivated ? `${leftWidth}%` : undefined,
	);
	let leftHeightResult = $derived(
		leftHeightActivated ? `${leftHeight}%` : undefined,
	);
	let leftInnerPaddingResult = $derived(
		leftInnerPaddingActivated ? leftInnerPadding : undefined,
	);
	let leftModeResult: 'spacing' | 'sizing' | undefined = $state(undefined);

	$effect(() => {
		leftModeResult = leftModeActivated
			? mode === 'sizing'
				? 'spacing'
				: 'sizing'
			: mode;
	});

	let rightWidthResult = $derived(
		rightWidthActivated ? `${rightWidth}%` : undefined,
	);
	let rightHeightResult = $derived(
		rightHeightActivated ? `${rightHeight}%` : undefined,
	);
	let rightInnerPaddingResult = $derived(
		rightInnerPaddingActivated ? rightInnerPadding : undefined,
	);
	let rightModeResult: 'spacing' | 'sizing' | undefined = $state(undefined);

	$effect(() => {
		rightModeResult = rightModeActivated
			? mode === 'sizing'
				? 'spacing'
				: 'sizing'
			: mode;
	});
</script>

<h1><img class="logo" alt="logo" src="./tilez_logo.svg" />tilez</h1>

<div class="intro">
	<p>A generic layout engine for Svelte components.</p>

	<p>
		See
		<a href="https://github.com/spren9er/tilez">GitHub</a> for documentation.
	</p>

	<p class="text">
		In the following, we consider one sample <b>tilez</b> layout for several different
		document types. There are 20 tiles in total in view hierarchy: 1 root tile, 7
		nested, stacked tiles and 12 (visible) leaf tiles. In principle, props of all
		tiles are reactive. Exemplarily, you can control props for the first three most
		outer tiles (including the whole outer horizontal stack).
	</p>
</div>

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
				<label for="innerPadding">innerPadding</label>
				<input type="range" min={0} max={20} bind:value={innerPadding} />
				<div class="value">{innerPadding}px</div>
			</div>
			<div>
				<label for="outerPadding">outerPadding</label>
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
		<h3>Left Inner Tile</h3>

		<form>
			<div>
				<label for="width">width</label>
				<input type="checkbox" bind:checked={leftWidthActivated} />
				<input
					type="range"
					min={0}
					max={100}
					bind:value={leftWidth}
					disabled={!leftWidthActivated}
				/>
				<div class="value">{leftWidth}%</div>
			</div>
			<div>
				<label for="height">height</label>
				<input type="checkbox" bind:checked={leftHeightActivated} />
				<input
					type="range"
					min={0}
					max={100}
					bind:value={leftHeight}
					disabled={!leftHeightActivated}
				/>
				<div class="value">{leftHeight}%</div>
			</div>
			<div>
				<label for="innerPadding">innerPadding</label>
				<input type="checkbox" bind:checked={leftInnerPaddingActivated} />
				<input
					type="range"
					min={0}
					max={20}
					bind:value={leftInnerPadding}
					disabled={!leftInnerPaddingActivated}
				/>
				<div class="value">{leftInnerPadding}px</div>
			</div>
			<div>
				<label for="outerPadding">outerPadding</label>
				<input type="checkbox" style:visibility="hidden" />
				<input type="range" min={0} max={20} bind:value={leftOuterPadding} />
				<div class="value">{leftOuterPadding}px</div>
			</div>
			<div>
				<label for="mode">mode</label>
				<input type="checkbox" bind:checked={leftModeActivated} />
				<select name="mode" bind:value={leftModeResult} disabled={true}>
					<option value="spacing">spacing</option>
					<option value="sizing">sizing</option>
				</select>
			</div>
			<div>
				<label for="hAlign">hAlign</label>
				<input type="checkbox" style:visibility="hidden" />
				<select
					name="hAlign"
					bind:value={leftHAlign}
					disabled={leftWidth + rightWidth >= 100}
				>
					<option value="left">left</option>
					<option value="center">center</option>
					<option value="right">right</option>
				</select>
			</div>
			<div>
				<label for="vAlign">vAlign</label>
				<input type="checkbox" style:visibility="hidden" />
				<select
					name="vAlign"
					bind:value={leftVAlign}
					disabled={!leftHeightActivated ||
						(leftHeightActivated && leftHeight === 100)}
				>
					<option value="top">top</option>
					<option value="center">center</option>
					<option value="bottom">bottom</option>
				</select>
			</div>
		</form>
	</div>

	<div class="form">
		<h3>Right Inner Tile</h3>

		<form>
			<div>
				<label for="width">width</label>
				<input type="checkbox" bind:checked={rightWidthActivated} />
				<input
					type="range"
					min={0}
					max={100}
					bind:value={rightWidth}
					disabled={!rightWidthActivated}
				/>
				<div class="value">{rightWidth}%</div>
			</div>
			<div>
				<label for="height">height</label>
				<input type="checkbox" bind:checked={rightHeightActivated} />
				<input
					type="range"
					min={0}
					max={100}
					bind:value={rightHeight}
					disabled={!rightHeightActivated}
				/>
				<div class="value">{rightHeight}%</div>
			</div>
			<div>
				<label for="innerPadding">innerPadding</label>
				<input type="checkbox" bind:checked={rightInnerPaddingActivated} />
				<input
					type="range"
					min={0}
					max={20}
					bind:value={rightInnerPadding}
					disabled={!rightInnerPaddingActivated}
				/>
				<div class="value">{rightInnerPadding}px</div>
			</div>
			<div>
				<label for="outerPadding">outerPadding</label>
				<input type="checkbox" style:visibility="hidden" />
				<input type="range" min={0} max={20} bind:value={rightOuterPadding} />
				<div class="value">{rightOuterPadding}px</div>
			</div>
			<div>
				<label for="mode">mode</label>
				<input type="checkbox" bind:checked={rightModeActivated} />
				<select name="mode" bind:value={rightModeResult} disabled={true}>
					<option value="spacing">spacing</option>
					<option value="sizing">sizing</option>
				</select>
			</div>
			<div>
				<label for="hAlign">hAlign</label>
				<input type="checkbox" style:visibility="hidden" />
				<select
					name="hAlign"
					bind:value={rightHAlign}
					disabled={leftWidth + rightWidth >= 100}
				>
					<option value="left">left</option>
					<option value="center">center</option>
					<option value="right">right</option>
				</select>
			</div>
			<div>
				<label for="vAlign">vAlign</label>
				<input type="checkbox" style:visibility="hidden" />
				<select
					name="vAlign"
					bind:value={rightVAlign}
					disabled={!rightHeightActivated ||
						(rightHeightActivated && rightHeight === 100)}
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
	{#each types as type}
		<div class="tile-type">
			<h3>{type}</h3>

			<div class="root-tile" style:width="{width}px" style:height="{height}px">
				<HTile {innerPadding} {outerPadding} {mode} {type}>
					<VTile
						width={leftWidthResult}
						height={leftHeightResult}
						innerPadding={leftInnerPaddingResult}
						outerPadding={leftOuterPadding}
						mode={leftModeResult}
						hAlign={leftHAlign}
						vAlign={leftVAlign}
					>
						<Tile height="15%">
							{@const SvelteComponent = boxFor(type)}
							<SvelteComponent />
						</Tile>
						<HTile>
							<Tile width="70px">
								{@const SvelteComponent_1 = boxFor(type)}
								<SvelteComponent_1 />
							</Tile>
							<Tile>
								{@const SvelteComponent_2 = boxFor(type)}
								<SvelteComponent_2 />
							</Tile>
						</HTile>
						<HTile height="70px">
							<Tile width="30%">
								{@const SvelteComponent_3 = boxFor(type)}
								<SvelteComponent_3 />
							</Tile>
							<Tile width="60%" hAlign="right">
								{@const SvelteComponent_4 = boxFor(type)}
								<SvelteComponent_4 />
							</Tile>
						</HTile>
						<Tile height="20%">
							{@const SvelteComponent_5 = boxFor(type)}
							<SvelteComponent_5 />
						</Tile>
					</VTile>
					<VTile
						width={rightWidthResult}
						height={rightHeightResult}
						innerPadding={rightInnerPaddingResult}
						outerPadding={rightOuterPadding}
						mode={rightModeResult}
						hAlign={rightHAlign}
						vAlign={rightVAlign}
					>
						<HTile height="40%" vAlign="top">
							<VTile width="75%">
								<Tile>
									{@const SvelteComponent_6 = boxFor(type)}
									<SvelteComponent_6 />
								</Tile>
								<Tile height="30%">
									{@const SvelteComponent_7 = boxFor(type)}
									<SvelteComponent_7 />
								</Tile>
							</VTile>
							<Tile>
								{@const SvelteComponent_8 = boxFor(type)}
								<SvelteComponent_8 />
							</Tile>
						</HTile>
						<Tile width="80%" hAlign="right">
							{@const SvelteComponent_9 = boxFor(type)}
							<SvelteComponent_9 />
						</Tile>
						<HTile height="30%" vAlign="bottom">
							<Tile>
								{@const SvelteComponent_10 = boxFor(type)}
								<SvelteComponent_10 />
							</Tile>
							<Tile width="50px">
								{@const SvelteComponent_11 = boxFor(type)}
								<SvelteComponent_11 />
							</Tile>
						</HTile>
					</VTile>
				</HTile>
			</div>
		</div>
	{/each}

	<div class="tile-type">
		<h3>Mixed</h3>

		<div class="root-tile" style:width="{width}px" style:height="{height}px">
			<HTile {innerPadding} {outerPadding} {mode} type="plain">
				<VTile
					width={leftWidthResult}
					height={leftHeightResult}
					innerPadding={leftInnerPaddingResult}
					outerPadding={leftOuterPadding}
					mode={leftModeResult}
					hAlign={leftHAlign}
					vAlign={leftVAlign}
				>
					<Tile height="15%" type="canvas">
						<TileCanvasBox />
					</Tile>
					<HTile type="html">
						<Tile width="70px" type="webgl">
							<TileWebGLBox />
						</Tile>
						<Tile>
							<TileHTMLBox />
						</Tile>
					</HTile>
					<HTile height="70px">
						<Tile width="30%" type="svg">
							<TileSVGBox />
						</Tile>
						<Tile width="60%" hAlign="right" type="canvas">
							<TileCanvasBox />
						</Tile>
					</HTile>
					<Tile height="20%" type="svg">
						<TileSVGBox />
					</Tile>
				</VTile>
				<VTile
					width={rightWidthResult}
					height={rightHeightResult}
					innerPadding={rightInnerPaddingResult}
					outerPadding={rightOuterPadding}
					mode={rightModeResult}
					hAlign={rightHAlign}
					vAlign={rightVAlign}
				>
					<HTile height="40%" vAlign="top">
						<VTile width="75%">
							<Tile type="webgl">
								<TileWebGLBox />
							</Tile>
							<Tile type="svg" height="30%">
								<TileSVGBox />
							</Tile>
						</VTile>
						<Tile type="html">
							<TileHTMLBox />
						</Tile>
					</HTile>
					<Tile width="80%" hAlign="right" type="canvas">
						<TileCanvasBox />
					</Tile>
					<HTile height="30%" vAlign="bottom" type="html">
						<Tile>
							<TileHTMLBox />
						</Tile>
						<Tile width="50px" type="svg">
							<TileSVGBox />
						</Tile>
					</HTile>
				</VTile>
			</HTile>
		</div>
	</div>
</div>

<div id="twitter-handle">
	<a href="https://twitter.com/spren9er">@spren9er</a>
</div>

<style>
	:global(body) {
		font-family: 'Courier New', Courier, monospace;
		font-size: 12px;
		color: #333333;
		background-color: #ffffff;
		margin: 50px;
		-moz-text-size-adjust: none;
		-webkit-text-size-adjust: none;
		text-size-adjust: none;
	}

	img.logo {
		position: relative;
		top: 1.5px;
		right: 4px;
	}

	h1 {
		text-align: center;
		margin: 70px 10px 20px 10px;
	}

	p.text {
		text-align: left;
		font-style: italic;
		margin-left: auto;
		margin-right: auto;
		max-width: 600px;
	}

	a,
	a:visited {
		color: #333333;
		font-weight: bold;
	}

	.intro {
		line-height: 130%;
		text-align: center;
		margin-bottom: 50px;
	}

	.forms {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.form {
		margin: 0px 20px 20px 20px;
	}

	.form h3 {
		text-align: center;
		padding-bottom: 4px;
		border-bottom: 1px solid #333333;
	}

	.form div.value {
		justify-content: end;
		padding-left: 6px;
		width: 30px;
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

	.tile-types {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.tile-type {
		margin: 10px;
		padding: 10px;
	}

	.tile-type h3 {
		margin: 0px 0px 2px 0px;
		text-transform: uppercase;
	}

	.root-tile {
		border: 1px solid #333333;
	}

	#twitter-handle {
		border-top: 1px solid #333333;
		margin-top: 20px;
		padding-top: 5px;
		width: 100%;
		text-align: center;
	}

	#twitter-handle a,
	#twitter-handle a:visited {
		font-size: 10px;
		color: #333333;
		text-decoration: none;
	}
</style>
