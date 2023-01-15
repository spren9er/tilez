<script lang="ts">
	import { onMount } from 'svelte';

	import type { TileNode } from '$lib/entities/tileNode';

	export let node: TileNode;
	export let containerWidth: number | undefined = undefined;
	export let containerHeight: number | undefined = undefined;

	// when no absolute size is given, size will be determined from parent;
	// then we don't need to set width and height on the wrapper;
	// otherwise wrapper size will be determined from specs (reactive)
	const sizeFromParent = node.specs?.hasEmptySize;

	$: ({ specs, isRoot } = node);
	$: width = specs?.width && !sizeFromParent ? `${specs?.width}px` : null;
	$: height = specs?.height && !sizeFromParent ? `${specs?.height}px` : null;

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if isRoot}
	<div
		class="tile-wrapper"
		class:visible
		style:width
		style:height
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}
	>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style>
	.tile-wrapper {
		position: relative;
		visibility: hidden;
		margin: 0;
		padding: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	slot {
		position: absolute;
		top: 0;
		left: 0;
	}

	.tile-wrapper.visible {
		visibility: visible;
	}
</style>
