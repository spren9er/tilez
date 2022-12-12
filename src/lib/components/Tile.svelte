<script lang="ts">
	import { onMount } from 'svelte';

	import type {
		TypeTilePropsStack,
		TypeTilePropsDimension,
		TypeTilePropsAlign,
	} from '$lib/types/tileProps.type';

	import { registerTile } from '$lib/services/registerTile';

	export let stack: TypeTilePropsStack | undefined = undefined;
	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign = 'center';

	let visible = false;

	const node = registerTile({ stack, width, height, align, padding });

	$: if ($node.isRoot) $node.updateSpecs(width!, height!);

	onMount(() => {
		visible = true;
	});
</script>

{#if $node.isRoot}
	<div id="root" class:visible>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style>
	#root {
		visibility: hidden;
	}

	#root.visible {
		visibility: visible;
	}
</style>
