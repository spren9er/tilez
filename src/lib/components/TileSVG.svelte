<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	import type { TileSpecs } from '$lib/valueObjects/tileSpecs';

	export let root: boolean;

	const specs: Writable<TileSpecs> = getContext('tilez');
</script>

{#if root}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="{$specs.width}px"
		height="{$specs.height}px"
		viewBox="0 0 {$specs.width} {$specs.height}"
	>
		<slot />
	</svg>
{:else}
	<g transform="translate({$specs.relX}, {$specs.relY})">
		<slot />
	</g>
{/if}
