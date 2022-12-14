<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileSVGExample from './TileSVG.svelte';

	let width = 500;
	let height = 500;
	let padding = 2;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

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
