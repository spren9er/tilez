<script lang="ts">
	import Tile from '$lib/components/Tile.svelte';
	import HTile from '$lib/components/HTile.svelte';
	import VTile from '$lib/components/VTile.svelte';

	import TileHTMLBox from '$examples/boxes/TileHTMLBox.svelte';
	import TileCanvasBox from '$examples/boxes/TileCanvasBox.svelte';
	import TileSVGBox from '$examples/boxes/TileSVGBox.svelte';

	let width = 800;
	let height = 600;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

<VTile {width} {height} innerPadding="10px" type="html" mode="spacing">
	<Tile height="50px">
		<h3>Example of Mixed Tile Types</h3>
	</Tile>
	<HTile>
		<VTile type="html">
			<HTile>
				<Tile>
					<TileHTMLBox />
				</Tile>
				<VTile type="svg">
					<Tile>
						<TileSVGBox />
					</Tile>
					<Tile>
						<TileSVGBox />
					</Tile>
					<Tile>
						<TileSVGBox />
					</Tile>
				</VTile>
			</HTile>
			<Tile type="canvas">
				<TileCanvasBox />
			</Tile>
		</VTile>
		<VTile type="svg">
			<HTile>
				<Tile>
					<TileSVGBox />
				</Tile>
				<VTile>
					<Tile>
						<TileSVGBox />
					</Tile>
					<Tile>
						<TileSVGBox />
					</Tile>
					<Tile>
						<TileSVGBox />
					</Tile>
				</VTile>
			</HTile>
			<Tile>
				<TileSVGBox />
			</Tile>
		</VTile>
		<VTile type="canvas">
			<HTile>
				<Tile>
					<TileCanvasBox />
				</Tile>
				<VTile>
					<Tile>
						<TileCanvasBox />
					</Tile>
					<Tile>
						<TileCanvasBox />
					</Tile>
					<Tile>
						<TileCanvasBox />
					</Tile>
				</VTile>
			</HTile>
			<Tile>
				<TileCanvasBox />
			</Tile>
		</VTile>
	</HTile>
</VTile>
