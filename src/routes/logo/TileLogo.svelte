<script lang="ts">
	import { getTileContext } from '$lib';

	export let fill = true;

	const { specs } = getTileContext();
</script>

<rect
	x={0}
	y={0}
	width={$specs.width}
	height={$specs.height}
	fill={fill ? '#999999' : 'transparent'}
	stroke="#777777"
	stroke-width="2.5"
/>
