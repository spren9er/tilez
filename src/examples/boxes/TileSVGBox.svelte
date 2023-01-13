<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs } = getTileContext();
</script>

<rect
	x={0}
	y={0}
	width={$specs.width}
	height={$specs.height}
	fill="#dedede"
	stroke="#cccccc"
/>
