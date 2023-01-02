<script lang="ts">
	import { getTileContext } from '$lib';

	export let fill = true;

	const { xScale, yScale } = getTileContext();
</script>

<rect
	x={0}
	y={0}
	width={$xScale(1)}
	height={$yScale(1)}
	fill={fill ? '#adbac7' : 'transparent'}
	stroke="#242931"
	stroke-width="2"
/>
