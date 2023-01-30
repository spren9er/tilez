<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';

	import Tile from '$lib/components/Tile.svelte';
	import HTile from '$lib/components/HTile.svelte';
	import VTile from '$lib/components/VTile.svelte';

	import TileSVGBox from '$examples/boxes/TileSVGBox.svelte';
	import TileHTMLBox from '$examples/boxes/TileHTMLBox.svelte';

	let width = 600;
	let height = 400;
	let svgElement: TypeTilePropsElement;

	export function element() {
		return svgElement;
	}
</script>

<HTile {width} {height} innerPadding="5px">
	<Tile />
	<VTile>
		<Tile />
		<HTile type="html">
			<Tile>
				<TileHTMLBox />
			</Tile>
			<VTile type="svg" bind:element={svgElement}>
				<Tile />
				<Tile>
					<TileSVGBox />
				</Tile>
			</VTile>
		</HTile>
	</VTile>
	<Tile />
</HTile>
