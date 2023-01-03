<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { TileNode } from '$lib/entities/tileNode';
	import { getContext } from 'svelte';

	import { getTileContext } from '$lib';

	const { specs } = getTileContext();

	const node: Writable<TileNode> = getContext('tilez-nodes');

	export let color: string | undefined = undefined;
	export let strokeWidth = 0.75;

	const stack = $node.parent?.props?.stack;
	if (stack && !color) {
		const stackDimension = $node.props.dim(
			stack === 'horizontal' ? 'width' : 'height',
		);

		if (stackDimension.unit === 'px') {
			color = '#333333';
		} else if (stackDimension.unit === '%') {
			color = '#777777';
		} else {
			color = '#cccccc';
		}
	}
</script>

{#if $specs}
	<rect
		x={0}
		y={0}
		width={$specs.width}
		height={$specs.height}
		fill={color}
		stroke="#333333"
		stroke-width={strokeWidth}
	/>
{/if}
