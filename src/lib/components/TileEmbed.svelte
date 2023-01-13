<script lang="ts">
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	export let node: TileNode;

	const { specs } = getTileContext();

	const parentNode = node.parent;
	const needsShift =
		node.rootType === 'subroot' && parentNode?.props.type === 'plain';

	$: posX =
		$specs.parentX + (needsShift ? parentNode?.specs?.subRootX || 0 : 0);
	$: posY =
		$specs.parentY + (needsShift ? parentNode?.specs?.subRootY || 0 : 0);
</script>

{#if node.rootType === 'subroot'}
	<div
		class="tile"
		style:left="{posX}px"
		style:top="{posY}px"
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
