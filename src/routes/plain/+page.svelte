<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TilePlain from './TilePlain.svelte';

	let width = 292;
	let height = 194;
	let innerPadding = 2;
	let outerPadding = 8;

	const Simple1DNoise = function () {
		const MAX_VERTICES = 256;
		const MAX_VERTICES_MASK = MAX_VERTICES - 1;
		let amplitude = 1;
		let scale = 1;

		const r = new Array(MAX_VERTICES).fill(0).map(() => Math.random());

		const getVal = function (x: number) {
			const scaledX = x * scale;
			const xFloor = Math.floor(scaledX);
			const t = scaledX - xFloor;
			const tRemapSmoothstep = t * t * (3 - 2 * t);

			const xMin = xFloor % MAX_VERTICES_MASK;
			const xMax = (xMin + 1) % MAX_VERTICES_MASK;

			const y = lerp(r[xMin], r[xMax], tRemapSmoothstep);

			return y * amplitude;
		};

		const lerp = function (a: number, b: number, t: number) {
			return a * (1 - t) + b * t;
		};

		return {
			getVal: getVal,
			setAmplitude: function (newAmplitude: number) {
				amplitude = newAmplitude;
			},
			setScale: function (newScale: number) {
				scale = newScale;
			},
		};
	};

	let widthCounter = 0;
	let heightCounter = 0;
	const widthGenerator = Simple1DNoise();
	const heightGenerator = Simple1DNoise();

	setInterval(() => {
		widthCounter += 0.04;
		heightCounter += 0.06;
		width = widthGenerator.getVal(widthCounter) * 800;
		height = heightGenerator.getVal(heightCounter) * 800;
	}, 100);
</script>

<div id="wrapper" style:width="{width}px" style:height="{height}px">
	<HTile {width} {height} {innerPadding} {outerPadding} vAlign="bottom">
		<VTile>
			<VTile height="30%" hAlign="center">
				<Tile>
					<TilePlain />
				</Tile>
				<Tile width="50%" height="50%">
					<TilePlain />
				</Tile>
				<Tile>
					<TilePlain />
				</Tile>
			</VTile>
			<Tile>
				<TilePlain />
			</Tile>
		</VTile>
		<Tile>
			<TilePlain />
		</Tile>
		<VTile width="100px" hAlign="right">
			<HTile>
				<Tile>
					<TilePlain />
				</Tile>
				<Tile>
					<TilePlain />
				</Tile>
				<Tile>
					<TilePlain />
				</Tile>
			</HTile>
			<Tile>
				<TilePlain />
			</Tile>
			<HTile width="80%">
				<Tile>
					<TilePlain />
				</Tile>
				<Tile>
					<TilePlain />
				</Tile>
			</HTile>
			<HTile vAlign="bottom">
				<Tile height="50%" vAlign="top">
					<TilePlain />
				</Tile>
				<Tile height="50%">
					<TilePlain />
				</Tile>
			</HTile>
		</VTile>
		<Tile width="20%">
			<TilePlain />
		</Tile>
		<VTile vAlign="center">
			<Tile height="60%">
				<TilePlain />
			</Tile>
		</VTile>
		<VTile hAlign="center" height="60%">
			<HTile width="60%" height="80%">
				<Tile>
					<TilePlain />
				</Tile>
				<Tile>
					<TilePlain />
				</Tile>
			</HTile>
			<Tile width="80px" height="100px" hAlign="right">
				<TilePlain />
			</Tile>
			<Tile>
				<TilePlain />
			</Tile>
			<Tile width="0.75">
				<TilePlain />
			</Tile>
		</VTile>
	</HTile>
</div>

<style>
	:global(html) {
		margin: 0;
		padding: 0;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	#wrapper {
		position: relative;
		border: 1px solid #333333;
	}
</style>
