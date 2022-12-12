<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	import type { TileSpecs } from '$lib/valueObjects/tileSpecs';

	export let root: boolean;

	const specs: Writable<TileSpecs> = getContext('tilez');
</script>

<slot />

{#if root}
	<div id="root-tile">
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
	#root-tile {
		position: relative;
	}

	.tile {
		position: absolute;
		top: var(--top);
		left: var(--left);
		width: var(--width);
		height: var(--height);
	}
</style>
