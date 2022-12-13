<script lang="ts">
	import { getSpecs } from '$lib';

	const specs = getSpecs();
</script>

<div
	class="tile"
	style="--width: {$specs.width}px; --height: {$specs.height}px"
/>

<style>
	.tile {
		position: absolute;
		box-sizing: border-box;
		width: var(--width);
		height: var(--height);
		background-color: #dedede;
		border: 1px solid #cccccc;
	}
</style>
