<script lang="ts">
	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	interface Props {
		node: TileNode;
		element?: TypeTilePropsElement | undefined;
		children?: import('svelte').Snippet<[any]>;
	}

	let { node, element = $bindable(undefined), children }: Props = $props();

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

	$effect(() => {
		if ($context && $specs && rootType) {
			resizeCanvasToDisplaySize();
		}
	});
</script>

{#if rootType}
	<TileEmbed {node}>
		<canvas bind:this={element}></canvas>

		{@render children?.({ element })}
	</TileEmbed>
{:else}
	{@render children?.({ element })}
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
