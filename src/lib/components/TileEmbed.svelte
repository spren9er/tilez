<script lang="ts">
	import type { TileNode } from '$lib/entities/tileNode';

	export let node: TileNode;

	$: ({ specs, coords, rootType } = node);
</script>

{#if rootType === 'subroot'}
	<div
		class="tile"
		style:left="{coords.x}px"
		style:top="{coords.y}px"
		style:width="{specs.width}px"
		style:height="{specs.height}px"
	>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style>
	.tile,
	slot {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		overflow: visible;
	}
</style>
