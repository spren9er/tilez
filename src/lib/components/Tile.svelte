<script lang="ts">
	import type {
		TypeTilePropsStack,
		TypeTilePropsDimension,
		TypeTilePropsAlign,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { setNodeContext } from '$lib/entities/tileContext';

	import TileWrapper from '$lib/components/TileWrapper.svelte';
	import TilePlain from '$lib/components/tileTypes/TilePlain.svelte';
	import TileSVG from '$lib/components/tileTypes/TileSVG.svelte';
	import TileHTML from '$lib/components/tileTypes/TileHTML.svelte';

	export let stack: TypeTilePropsStack | undefined = undefined;
	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;

	const node = setNodeContext({ stack, width, height, align, padding, type });
	const root = $node.isRoot;

	const componentFor = (node: TileNode) => {
		const componentMapping = {
			plain: TilePlain,
			svg: TileSVG,
			html: TileHTML,
		};

		return componentMapping[node.props.type || 'plain'];
	};

	$: if (root) $node.updateSpecs(width!, height!);
</script>

<TileWrapper {root}>
	<svelte:component this={componentFor($node)} {root}>
		<slot />
	</svelte:component>
</TileWrapper>
