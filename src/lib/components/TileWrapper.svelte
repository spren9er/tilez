<script lang="ts">
	import { onMount } from 'svelte';

	import type { TileNode } from '$lib/entities/tileNode';

	export let node: TileNode;
	export let containerWidth: number | undefined = undefined;
	export let containerHeight: number | undefined = undefined;

	const { specs, isRoot } = node;
	const width = specs?.width ? `${specs?.width}px` : null;
	const height = specs?.height ? `${specs?.height}px` : null;

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if isRoot}
	<div
		id="tile-wrapper"
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
	#tile-wrapper {
		position: relative;
		visibility: hidden;
		margin: 0;
		padding: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	#tile-wrapper.visible {
		visibility: visible;
	}
</style>
