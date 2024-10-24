<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { TileNode } from '$lib/entities/tileNode';

	interface Props {
		node: TileNode;
		children?: Snippet;
	}

	let { node, children }: Props = $props();

	let { specs, coords, rootType } = $derived(node);
</script>

{#if rootType === 'subroot'}
	<div
		class="tile"
		style:left="{coords.x}px"
		style:top="{coords.y}px"
		style:width="{specs.width}px"
		style:height="{specs.height}px"
	>
		{@render children?.()}
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
	.tile {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		overflow: visible;
	}
</style>
