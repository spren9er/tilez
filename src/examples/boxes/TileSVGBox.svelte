<script lang="ts">
	import { getTileContext } from '$lib/entities/tileContext';

	const { specs } = getTileContext();
</script>

<rect
	x={0.5}
	y={0.5}
	width={$specs.width - 1}
	height={$specs.height - 1}
	fill="#eaeaea"
	stroke="#aaaaaa"
/>
