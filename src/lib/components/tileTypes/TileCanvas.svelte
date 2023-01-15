<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';
	import type { TileProps } from '$lib/valueObjects/tileProps';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, context } = getTileContext();

	const { rootType } = node;

	// when inner padding, outer padding or mode changes, we need to redraw
	let lastDerivedProps = node.derivedProps.copy();

	function propsChanged(props1: TileProps, props2: TileProps) {
		return (
			props1.innerPadding !== props2.innerPadding ||
			props1.outerPadding !== props2.outerPadding ||
			props1.mode !== props2.mode
		);
	}

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

		if (
			!propsChanged(lastDerivedProps, node.derivedProps) &&
			canvas.width === canvasWidth &&
			canvas.height === canvasHeight
		)
			return;

		lastDerivedProps = node.derivedProps.copy();

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		canvas.style.width = `${$specs.width}px`;
		canvas.style.height = `${$specs.height}px`;

		$context.scale(dpr, dpr);
	}

	$: if ($context || $specs) {
		if (rootType) resizeCanvasToDisplaySize();
		createSubContext();
	}
</script>

{#if rootType}
	<TileEmbed {node}>
		<canvas bind:this={element} />
		<slot {element} />
	</TileEmbed>
{:else}
	<slot {element} />
{/if}

<style>
	canvas {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
	}
</style>
