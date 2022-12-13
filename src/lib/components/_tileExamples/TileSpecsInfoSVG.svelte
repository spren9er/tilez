<script lang="ts">
	import { getSpecs } from '$lib';

	const specs = getSpecs();
</script>

<rect
	x={0}
	y={0}
	width={$specs.width}
	height={$specs.height}
	fill="#dedede"
	stroke="#cccccc"
/>
