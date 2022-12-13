<script lang="ts">
	import { onMount } from 'svelte';

	export let root: boolean;

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if root}
	<div id="tile-wrapper" class:visible>
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
	}

	#tile-wrapper.visible {
		visibility: visible;
	}
</style>
