<script lang="ts">
	import { getTileContext } from '$lib';

	export let outerPaddingColor = 'transparent';
	export let color = '#efefef';

	const { specs } = getTileContext();
</script>

{#if $specs}
	<rect
		x={0}
		y={0}
		width={$specs.width}
		height={$specs.height}
		fill={outerPaddingColor}
		stroke={outerPaddingColor}
	/>

	<rect
		x={$specs.outerPadding}
		y={$specs.outerPadding}
		width={$specs.width - 2 * $specs.outerPadding}
		height={$specs.height - 2 * $specs.outerPadding}
		fill={color}
		stroke="#333333"
	/>
{/if}
