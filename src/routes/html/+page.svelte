<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileHTML from './TileHTML.svelte';

	let width = 500;
	let height = 500;
	let padding = 2;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

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
