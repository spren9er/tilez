<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import TileLogo from './TileLogo.svelte';

	let size = 64;
	let padding = 3;

	const goldenRatio = 1.61803398875;
	const ratio = 1 - 1 / goldenRatio;
</script>

<HTile width={size} height={size} {padding} type="svg">
	<VTile width={ratio}>
		<Tile height={ratio}>
			<TileLogo />
		</Tile>
		<Tile>
			<TileLogo fill={false} />
		</Tile>
	</VTile>
	<VTile>
		<Tile height={ratio}>
			<TileLogo fill={false} />
		</Tile>
		<Tile>
			<TileLogo />
		</Tile>
	</VTile>
</HTile>
