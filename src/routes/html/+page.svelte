<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileHTML from './TileHTML.svelte';

	let width = 900;
	let height = 600;
	let padding = 2;
</script>

<input type="range" min={900 - 250} max={900 + 250} bind:value={width} />
<input type="range" min={600 - 250} max={600 + 250} bind:value={height} />

<HTile {width} {height} {padding} type="html">
	<VTile>
		<Tile width="50%">
			<TileHTML />
		</Tile>
		<Tile>
			<TileHTML />
		</Tile>
		<Tile width="50px" height="50px">
			<TileHTML />
		</Tile>
	</VTile>
	<Tile>
		<TileHTML />
	</Tile>
	<Tile>
		<TileHTML />
	</Tile>
</HTile>
