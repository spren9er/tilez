<script lang="ts">
	import type { TypeTileNodeRootType } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	export let rootType: TypeTileNodeRootType | undefined = undefined;

	const { specs } = getTileContext();
</script>

{#if rootType === 'subroot'}
	<div
		class="tile"
		style:left="{$specs.parentX}px"
		style:top="{$specs.parentY}px"
		style:width="{$specs.width}px"
		style:height="{$specs.height}px"
	>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style>
	.tile {
		position: absolute;
		margin: 0;
		padding: 0;
	}
</style>
