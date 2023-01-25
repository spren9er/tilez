<script lang="ts">
	import type {
		TypeTilePropsStack,
		TypeTilePropsDimension,
		TypeTilePropsHAlign,
		TypeTilePropsVAlign,
		TypeTilePropsType,
		TypeTilePropsMode,
		TypeTilePropsElement,
	} from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { setNodeContext, getTileContext } from '$lib/entities/tileContext';

	import TileWrapper from '$lib/components/TileWrapper.svelte';
	import TilePlain from '$lib/components/tileTypes/TilePlain.svelte';
	import TileHTML from '$lib/components/tileTypes/TileHTML.svelte';
	import TileSVG from '$lib/components/tileTypes/TileSVG.svelte';
	import TileCanvas from '$lib/components/tileTypes/TileCanvas.svelte';

	export let stack: TypeTilePropsStack | undefined = undefined;
	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let innerPadding: TypeTilePropsDimension | undefined = undefined;
	export let outerPadding: TypeTilePropsDimension | undefined = undefined;
	export let hAlign: TypeTilePropsHAlign | undefined = undefined;
	export let vAlign: TypeTilePropsVAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;
	export let mode: TypeTilePropsMode | undefined = undefined;
	export let element: TypeTilePropsElement | undefined = undefined;

	let containerWidth: number;
	let containerHeight: number;
	let init = true;

	const rawProps = {
		width,
		height,
		innerPadding,
		outerPadding,
		hAlign,
		vAlign,
		type,
		mode,
		stack,
	};
	const node = setNodeContext(rawProps);

	const { element: elementStore } = getTileContext();

	const componentFor = (node: TileNode) => {
		const componentMapping = {
			plain: TilePlain,
			html: TileHTML,
			svg: TileSVG,
			canvas: TileCanvas,
		};

		return componentMapping[node.specs.type];
	};

	$: if (element) elementStore.set(element);

	$: {
		const rawProps = {
			width,
			height,
			innerPadding,
			outerPadding,
			hAlign,
			vAlign,
			type,
			mode,
			stack,
		};

		rawProps.width ||= containerWidth;
		rawProps.height ||= containerHeight;

		if (!init) node.updateNodes(rawProps);

		init = false;
	}
</script>

<TileWrapper node={$node} bind:containerWidth bind:containerHeight>
	<svelte:component this={componentFor($node)} node={$node} bind:element>
		<slot {element} />
	</svelte:component>
</TileWrapper>
