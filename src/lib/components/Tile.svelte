<script lang="ts">
	import { onMount } from 'svelte';

	import type {
		TypeTilePropsStack,
		TypeTilePropsDimension,
		TypeTilePropsAlign,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';
	import type { TileNode } from '$lib/entities/tileNode';

	import { registerTile } from '$lib/services/registerTile';

	import TilePlain from '$lib/components/TilePlain.svelte';
	import TileSVG from '$lib/components/TileSVG.svelte';
	import TileHTML from '$lib/components/TileHTML.svelte';

	export let stack: TypeTilePropsStack | undefined = undefined;
	export let width: TypeTilePropsDimension | undefined = undefined;
	export let height: TypeTilePropsDimension | undefined = undefined;
	export let padding: TypeTilePropsDimension | undefined = undefined;
	export let align: TypeTilePropsAlign | undefined = undefined;
	export let type: TypeTilePropsType | undefined = undefined;

	let visible = false;

	const node = registerTile({ stack, width, height, align, padding, type });
	const root = $node.isRoot;

	const componentFor = (node: TileNode) => {
		const component_mapping = {
			plain: TilePlain,
			svg: TileSVG,
			html: TileHTML,
		};

		return component_mapping[node.props.type || 'plain'];
	};

	$: if (root) $node.updateSpecs(width!, height!);

	onMount(() => {
		visible = true;
	});
</script>

{#if root}
	<div id="root" class:visible>
		<svelte:component this={componentFor($node)} {root}>
			<slot />
		</svelte:component>
	</div>
{:else}
	<svelte:component this={componentFor($node)} {root}>
		<slot />
	</svelte:component>
{/if}

<style>
	#root {
		visibility: hidden;
	}

	#root.visible {
		visibility: visible;
	}
</style>
