<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileHTMLBox from '$fixtures/boxes/TileHTMLBox.svelte';

	let width = 500;
	let height = 500;
	let innerPadding = 2;
	let outerPadding = 2;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

<HTile {width} {height} {innerPadding} {outerPadding} type="html">
	<VTile>
		<Tile width="50%">
			<TileHTMLBox />
		</Tile>
		<Tile>
			<TileHTMLBox />
		</Tile>
		<Tile width="50px" height="50px">
			<TileHTMLBox />
		</Tile>
	</VTile>
	<Tile>
		<TileHTMLBox />
	</Tile>
	<Tile>
		<TileHTMLBox />
	</Tile>
</HTile>
