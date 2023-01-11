<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileCanvasBox from '$fixtures/boxes/TileCanvasBox.svelte';

	let width = 500;
	let height = 500;
	let innerPadding = 4;
	let outerPadding = 4;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

<HTile {width} {height} {innerPadding} {outerPadding} type="canvas">
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
