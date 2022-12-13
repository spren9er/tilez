<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileSpecsInfo from '$lib/components/_tileExamples/TileSpecsInfo.svelte';

	let width = 900;
	let height = 600;
	let padding = 2;
</script>

<input type="range" min={900 - 250} max={900 + 250} bind:value={width} />
<input type="range" min={600 - 250} max={600 + 250} bind:value={height} />

<div id="wrapper">
	<HTile {width} {height} {padding}>
		<VTile>
			<Tile height="30%">
				<TileSpecsInfo />
			</Tile>
			<Tile>
				<TileSpecsInfo />
			</Tile>
		</VTile>
		<Tile>
			<TileSpecsInfo />
		</Tile>
		<VTile width="220px">
			<Tile>
				<TileSpecsInfo />
			</Tile>
			<Tile>
				<TileSpecsInfo />
			</Tile>
			<HTile width="80%">
				<Tile>
					<TileSpecsInfo />
				</Tile>
				<Tile>
					<TileSpecsInfo />
				</Tile>
			</HTile>
			<HTile>
				<Tile height="50%" align="bottom">
					<TileSpecsInfo />
				</Tile>
				<Tile height="50%" align="top">
					<TileSpecsInfo />
				</Tile>
			</HTile>
		</VTile>
		<Tile width="20%">
			<TileSpecsInfo />
		</Tile>
		<Tile height="60%" align="center">
			<TileSpecsInfo />
		</Tile>
		<VTile>
			<HTile>
				<Tile>
					<TileSpecsInfo />
				</Tile>
				<Tile>
					<TileSpecsInfo />
				</Tile>
			</HTile>
			<Tile width="80" height="100px" align="center">
				<TileSpecsInfo />
			</Tile>
			<Tile>
				<TileSpecsInfo />
			</Tile>
			<Tile width="0.75" align="right">
				<TileSpecsInfo />
			</Tile>
		</VTile>
	</HTile>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#wrapper {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
</style>
