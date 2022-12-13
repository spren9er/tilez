<script lang="ts">
	import { getSpecs } from '$lib/entities/tileSpecs';

	export let root: boolean;

	const specs = getSpecs();
</script>

{#if root}
	<div id="tile-root">
		<slot />
	</div>
{:else}
	<div
		class="tile"
		style="
      --top: {$specs.relY}px;
      --left: {$specs.relX}px;
      --width: {$specs.width}px;
      --height: {$specs.height}px"
	>
		<slot />
	</div>
{/if}

<style>
	#tile-root {
		position: relative;
		margin: 0;
		padding: 0;
	}

	.tile {
		position: absolute;
		top: var(--top);
		left: var(--left);
		width: var(--width);
		height: var(--height);
		margin: 0;
		padding: 0;
	}
</style>
