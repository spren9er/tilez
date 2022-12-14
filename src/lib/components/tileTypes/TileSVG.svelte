<script lang="ts">
	import { getSpecsContext } from '$lib/entities/tileContext';

	export let root: boolean;

	const specs = getSpecsContext();
</script>

{#if root}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={$specs.width}
		height={$specs.height}
		viewBox="0 0 {$specs.width} {$specs.height}"
	>
		<slot />
	</svg>
{:else}
	<g transform="translate({$specs.relX}, {$specs.relY})">
		<slot />
	</g>
{/if}
