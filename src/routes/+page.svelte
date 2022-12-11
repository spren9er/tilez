<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import ContextInfo from '$lib/components/ContextInfo.svelte';

	let width = 900;
	let height = 600;
	let padding = 2;
</script>

<input type="range" min={900 - 250} max={900 + 250} bind:value={width} />
<input type="range" min={600 - 250} max={600 + 250} bind:value={height} />

<div id="wrapper">
	<HTile {width} {height} {padding}>
		<VTile>
			<Tile height="30%">
				<ContextInfo />
			</Tile>
			<Tile>
				<ContextInfo />
			</Tile>
		</VTile>
		<Tile>
			<ContextInfo />
		</Tile>
		<VTile width="220px">
			<Tile>
				<ContextInfo />
			</Tile>
			<Tile>
				<ContextInfo />
			</Tile>
			<HTile width="80%">
				<Tile>
					<ContextInfo />
				</Tile>
				<Tile>
					<ContextInfo />
				</Tile>
			</HTile>
			<HTile>
				<Tile height="50%" align="bottom">
					<ContextInfo />
				</Tile>
				<Tile height="50%" align="top">
					<ContextInfo />
				</Tile>
			</HTile>
		</VTile>
		<Tile width="20%">
			<ContextInfo />
		</Tile>
		<Tile height="60%" align="center">
			<ContextInfo />
		</Tile>
		<VTile>
			<HTile>
				<Tile>
					<ContextInfo />
				</Tile>
				<Tile>
					<ContextInfo />
				</Tile>
			</HTile>
			<Tile width="80" height="100px" align="center">
				<ContextInfo />
			</Tile>
			<Tile>
				<ContextInfo />
			</Tile>
			<Tile width="0.75" align="right">
				<ContextInfo />
			</Tile>
		</VTile>
	</HTile>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#wrapper {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
</style>
