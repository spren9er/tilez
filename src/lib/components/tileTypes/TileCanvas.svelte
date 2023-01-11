<script lang="ts">
	import { onMount } from 'svelte';

	import type { TypeTilePropsElement } from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { getTileContext } from '$lib/entities/tileContext';

	import TileEmbed from '$lib/components/TileEmbed.svelte';

	export let node: TileNode;
	export let element: TypeTilePropsElement | undefined = undefined;

	let context: CanvasRenderingContext2D | null;

	const { specs, element: elementStore } = getTileContext();

	function createSubContextFrom(element: HTMLCanvasElement) {
		context = element.getContext('2d');

		if (context) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.translate($specs.subRootX, $specs.subRootY);
		}
	}

	function resizeCanvasToDisplaySize(canvas?: HTMLCanvasElement) {
		if (!canvas) return;

		const dpr = window.devicePixelRatio;
		canvas.width = Math.round($specs.width * dpr);
		canvas.height = Math.round($specs.height * dpr);

		const context = canvas.getContext('2d');

		context?.scale(dpr, dpr);
	}

	onMount(() => {
		resizeCanvasToDisplaySize(element as HTMLCanvasElement);
		elementStore.set(element!);
	});

	$: if (!node.isSubRoot && $specs && $elementStore) {
		createSubContextFrom($elementStore as HTMLCanvasElement);
	}
</script>

{#if node.isSubRoot}
	<TileEmbed {node}>
		<canvas bind:this={element} />
		<slot {element} />
	</TileEmbed>
{:else}
	<slot {element} />
{/if}
