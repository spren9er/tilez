<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileSpecs from '$lib/components/TileSpecs.svelte';

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
				<TileSpecs />
			</Tile>
			<Tile>
				<TileSpecs />
			</Tile>
		</VTile>
		<Tile>
			<TileSpecs />
		</Tile>
		<VTile width="220px">
			<Tile>
				<TileSpecs />
			</Tile>
			<Tile>
				<TileSpecs />
			</Tile>
			<HTile width="80%">
				<Tile>
					<TileSpecs />
				</Tile>
				<Tile>
					<TileSpecs />
				</Tile>
			</HTile>
			<HTile>
				<Tile height="50%" align="bottom">
					<TileSpecs />
				</Tile>
				<Tile height="50%" align="top">
					<TileSpecs />
				</Tile>
			</HTile>
		</VTile>
		<Tile width="20%">
			<TileSpecs />
		</Tile>
		<Tile height="60%" align="center">
			<TileSpecs />
		</Tile>
		<VTile>
			<HTile>
				<Tile>
					<TileSpecs />
				</Tile>
				<Tile>
					<TileSpecs />
				</Tile>
			</HTile>
			<Tile width="80" height="100px" align="center">
				<TileSpecs />
			</Tile>
			<Tile>
				<TileSpecs />
			</Tile>
			<Tile width="0.75" align="right">
				<TileSpecs />
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
