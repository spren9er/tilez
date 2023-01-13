<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileSVGBox from '$examples/boxes/TileSVGBox.svelte';

	let width = 500;
	let height = 500;
	let innerPadding = 4;
	let outerPadding = 4;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

<HTile {width} {height} {innerPadding} {outerPadding} type="svg">
	<VTile>
		<Tile width="60%">
			<TileSVGBox />
		</Tile>
		<Tile>
			<TileSVGBox />
		</Tile>
		<Tile width="50px" height="50px">
			<TileSVGBox />
		</Tile>
	</VTile>
	<Tile>
		<TileSVGBox />
	</Tile>
	<Tile>
		<TileSVGBox />
	</Tile>
</HTile>
