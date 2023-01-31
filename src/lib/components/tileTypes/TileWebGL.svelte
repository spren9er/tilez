<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	const { specs, context } = getTileContext();

	const { rootType } = node;

	function resizeCanvasToDisplaySize() {
		if (!$context || !$specs) return;

		const dpr = window.devicePixelRatio || 1;
		const canvas = $context.canvas as HTMLCanvasElement;

		const canvasWidth = Math.round($specs.width * dpr);
		const canvasHeight = Math.round($specs.height * dpr);

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		canvas.style.width = `${$specs.width}px`;
		canvas.style.height = `${$specs.height}px`;
	}

	$: if ($context && $specs && rootType) {
		resizeCanvasToDisplaySize();
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
	canvas,
	slot {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
	}
</style>
