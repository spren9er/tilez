<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileSVGExample from './TileSVG.svelte';

	let width = 900;
	let height = 600;
	let padding = 2;
</script>

<input type="range" min={900 - 250} max={900 + 250} bind:value={width} />
<input type="range" min={600 - 250} max={600 + 250} bind:value={height} />

<HTile {width} {height} {padding} type="svg">
	<VTile>
		<Tile width="50%">
			<TileSVGExample />
		</Tile>
		<Tile>
			<TileSVGExample />
		</Tile>
		<Tile width="50px" height="50px">
			<TileSVGExample />
		</Tile>
	</VTile>
	<Tile>
		<TileSVGExample />
	</Tile>
	<Tile>
		<TileSVGExample />
	</Tile>
</HTile>
