<script lang="ts">
	import { getSpecsContext } from '$lib';

	export let fill = true;

	const specs = getSpecsContext();
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
