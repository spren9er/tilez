<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TilePlain from './TilePlain.svelte';

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
				<TilePlain />
			</Tile>
			<Tile>
				<TilePlain />
			</Tile>
		</VTile>
		<Tile>
			<TilePlain />
		</Tile>
		<VTile width="220px">
			<Tile>
				<TilePlain />
			</Tile>
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
			<HTile>
				<Tile height="50%" align="bottom">
					<TilePlain />
				</Tile>
				<Tile height="50%" align="top">
					<TilePlain />
				</Tile>
			</HTile>
		</VTile>
		<Tile width="20%">
			<TilePlain />
		</Tile>
		<Tile height="60%" align="center">
			<TilePlain />
		</Tile>
		<VTile>
			<HTile>
				<Tile>
					<TilePlain />
				</Tile>
				<Tile>
					<TilePlain />
				</Tile>
			</HTile>
			<Tile width="80" height="100px" align="center">
				<TilePlain />
			</Tile>
			<Tile>
				<TilePlain />
			</Tile>
			<Tile width="0.75" align="right">
				<TilePlain />
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
