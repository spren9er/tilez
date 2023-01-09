<script lang="ts">
	import { onMount } from 'svelte';

	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';

	import { getTileContext } from '$lib/entities/tileContext';

	export let root: boolean;
	export let element: TypeTilePropsElement | undefined = undefined;

	let context: CanvasRenderingContext2D | null;

	const { specs, element: elementStore } = getTileContext();

	function createSubContextFrom(element: HTMLCanvasElement) {
		context = element.getContext('2d');

		if (context) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.translate($specs.absX, $specs.absY);
		}
	}

	onMount(() => elementStore.set(element!));

	$: if ($specs && $elementStore && !root) {
		createSubContextFrom($elementStore as HTMLCanvasElement);
	}
</script>

{#if root}
	<canvas width={$specs.width} height={$specs.height} bind:this={element} />
{/if}

<slot {element} />
