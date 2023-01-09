<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';

	import { getTileContext } from '$lib/entities/tileContext';

	export let root: boolean;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, element: elementStore } = getTileContext();

	$: if (element) elementStore.set(element);
</script>

{#if root}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={$specs.width}
		height={$specs.height}
		viewBox="0 0 {$specs.width} {$specs.height}"
		bind:this={element}
	>
		<slot {element} />
	</svg>
{:else}
	<g transform="translate({$specs.relX}, {$specs.relY})" bind:this={element}>
		<slot {element} />
	</g>
{/if}

<style>
	svg {
		display: block;
	}
</style>
