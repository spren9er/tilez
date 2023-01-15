<script lang="ts">
	import { getTileContext } from '$lib/entities/tileContext';

	const { specs } = getTileContext();

	$: width = $specs.width >= 1 ? $specs.width - 1 : 0;
	$: height = $specs.height >= 1 ? $specs.height - 1 : 0;
</script>

<rect x={0.5} y={0.5} {width} {height} fill="#eaeaea" stroke="#aaaaaa" />
