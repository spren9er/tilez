<script lang="ts">
	import { getTileContext } from '$lib/entities/tileContext';

	export let root: boolean;

	const { specs } = getTileContext();
</script>

<div
	class:root
	class="tile"
	style="
      --top: {$specs.relY}px;
      --left: {$specs.relX}px;
      --width: {$specs.width}px;
      --height: {$specs.height}px"
>
	<slot />
</div>

<style>
	.tile {
		position: absolute;
		top: var(--top);
		left: var(--left);
		width: var(--width);
		height: var(--height);
		margin: 0;
		padding: 0;
	}

	.root.tile {
		position: relative;
	}
</style>
