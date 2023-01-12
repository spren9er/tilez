<script lang="ts">
	import { onMount } from 'svelte';

	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TypeTileNodeRootType } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	export let rootType: TypeTileNodeRootType | undefined = undefined;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, element: elementStore, context } = getTileContext();

	function createSubContext() {
		if (!$context) return;

		const dpr = window.devicePixelRatio || 1;

		$context.setTransform(1, 0, 0, 1, 0, 0);
		$context.translate($specs.subRootX * dpr, $specs.subRootY * dpr);
	}

	function resizeCanvasToDisplaySize() {
		if (!$context) return;

		const dpr = window.devicePixelRatio || 1;
		const canvas = $context.canvas;

		const canvasWidth = Math.round($specs.width * dpr);
		const canvasHeight = Math.round($specs.height * dpr);

		if (canvas.width === canvasWidth && canvas.height === canvasHeight) return;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		canvas.style.width = `${$specs.width}px`;
		canvas.style.height = `${$specs.height}px`;

		$context.scale(dpr, dpr);
	}

	onMount(() => {
		if (rootType) {
			elementStore.set(element!);
			resizeCanvasToDisplaySize();
		}
	});

	$: if ($specs) {
		rootType ? resizeCanvasToDisplaySize() : createSubContext();
	}
</script>

{#if $specs}
	{#if rootType}
		<TileEmbed {rootType}>
			<canvas bind:this={element} />
			<slot {element} />
		</TileEmbed>
	{:else}
		<slot {element} />
	{/if}
{/if}
