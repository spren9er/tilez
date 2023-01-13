<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, context } = getTileContext();

	const { rootType } = node;

	// needed when root tile has no absolute size: specs are empty first!
	// once there is a non-trivial size, component should not be hidden anymore
	let initialized = false;

	$: if (!$specs.hasEmptySize) initialized = true;

	function createSubContext() {
		if (!$context || !$specs) return;

		const dpr = window.devicePixelRatio || 1;

		$context.setTransform(1, 0, 0, 1, 0, 0);
		$context.translate($specs.subRootX * dpr, $specs.subRootY * dpr);
	}

	function resizeCanvasToDisplaySize() {
		if (!$context || !$specs) return;

		const dpr = window.devicePixelRatio || 1;
		const canvas = $context.canvas;

		const canvasWidth = Math.round($specs.width * dpr);
		const canvasHeight = Math.round($specs.height * dpr);

		if (canvasWidth === 0 || canvasHeight === 0) return;
		if (canvas.width === canvasWidth && canvas.height === canvasHeight) return;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		canvas.style.width = `${$specs.width}px`;
		canvas.style.height = `${$specs.height}px`;

		$context.scale(dpr, dpr);
	}

	$: if ($context || $specs)
		rootType ? resizeCanvasToDisplaySize() : createSubContext();
</script>

{#if !$specs.hasEmptySize || initialized}
	{#if rootType}
		<TileEmbed {node}>
			<canvas bind:this={element} />
			<slot {element} />
		</TileEmbed>
	{:else}
		<slot {element} />
	{/if}
{/if}
