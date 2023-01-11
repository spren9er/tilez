<script lang="ts">
	import { onMount } from 'svelte';

	import { getTileContext } from '$lib/entities/tileContext';

	const { specs } = getTileContext();

	export let root: boolean;
	export let containerWidth: number | undefined = undefined;
	export let containerHeight: number | undefined = undefined;

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if root}
	<div
		id="tile-wrapper"
		class:visible
		style:width="{$specs.width}px"
		style:height="{$specs.height}px"
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
		visibility: hidden;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	#tile-wrapper.visible {
		visibility: visible;
	}
</style>
