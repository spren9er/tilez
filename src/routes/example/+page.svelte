<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import type { TypeTilePropsMode } from '$lib/types/tileProps.type';

	import TileBorder from './TileBorder.svelte';

	let width = 600;
	let height = 600;
	let innerPadding = 10;
	let outerPadding = 10;
	let mode = 'sizing' as TypeTilePropsMode;
</script>

<input type="range" min={0} max={1000} bind:value={width} />
<input type="range" min={0} max={1000} bind:value={height} />

<div id="wrapper">
	<div style="width: {width}px; height: {height}px; border: 1px solid #333333">
		<VTile {width} {height} {innerPadding} {outerPadding} {mode} type="svg">
			<Tile>
				<TileBorder />
			</Tile>
			<HTile>
				<Tile>
					<TileBorder />
				</Tile>
				<Tile width="450px" hAlign="right">
					<TileBorder />
				</Tile>
			</HTile>
			<HTile>
				<Tile width="60%">
					<TileBorder />
				</Tile>
				<Tile width="60%">
					<TileBorder />
				</Tile>
			</HTile>
			<HTile>
				<Tile>
					<TileBorder />
				</Tile>
				<Tile width="75%">
					<TileBorder />
				</Tile>
			</HTile>
			<HTile>
				<Tile>
					<TileBorder />
				</Tile>
				<Tile>
					<TileBorder />
				</Tile>
				<Tile width="50%">
					<TileBorder />
				</Tile>
			</HTile>
			<HTile>
				<Tile>
					<TileBorder />
				</Tile>
				<Tile>
					<TileBorder />
				</Tile>
				<VTile>
					<HTile>
						<Tile>
							<TileBorder />
						</Tile>
						<Tile>
							<TileBorder />
						</Tile>
					</HTile>
					<Tile>
						<TileBorder />
					</Tile>
					<Tile>
						<TileBorder />
					</Tile>
				</VTile>
			</HTile>
		</VTile>
	</div>
</div>
