<script lang="ts">
	import type {
		TypeTilePropsStack,
		TypeTilePropsDimension,
		TypeTilePropsAlign,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { registerTile } from '$lib/services/tileRegistration';

	import TilePlain from '$lib/components/TilePlain.svelte';
	import TileSVG from '$lib/components/TileSVG.svelte';
	import TileHTML from '$lib/components/TileHTML.svelte';
	import TileWrapper from '$lib/components/TileWrapper.svelte';

	export let stack: TypeTilePropsStack | undefined = undefined;
	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;

	const node = registerTile({ stack, width, height, align, padding, type });
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
