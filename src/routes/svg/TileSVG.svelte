<script lang="ts">
	import { getSpecsContext } from '$lib';

	const specs = getSpecsContext();
</script>

<rect
	x={0}
	y={0}
	width={$specs.width}
	height={$specs.height}
	fill="#dedede"
	stroke="#cccccc"
/>
