<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs } = getTileContext();

	const format = (number: number) => Number(number).toFixed(0);
</script>

{#if $specs.width > 0 && $specs.height > 0}
	<div
		class="tile"
		style="
			top: {$specs.rootY}px;
			left: {$specs.rootX}px;
			width: {$specs.width}px;
			height: {$specs.height}px;
		"
	>
		<ul>
			<li><b>Width x Height</b></li>
			<li class="specs">{format($specs.width)} x {format($specs.height)}</li>
			<li><b>X / Y (rel.)</b></li>
			<li class="specs">{format($specs.parentX)} / {format($specs.parentY)}</li>
			<li><b>X / Y (abs.)</b></li>
			<li class="specs">{format($specs.rootX)} / {format($specs.rootY)}</li>
		</ul>
	</div>
{/if}

<style>
	.tile {
		position: absolute;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #dedede;
		border: 1px solid #cccccc;
	}

	ul {
		font-family: 'Courier New', Courier, monospace;
		letter-spacing: -0.5px;
		font-size: 7px;
		padding: 0 0 0 8px;
		list-style-type: none;
	}

	ul li.specs {
		padding-bottom: 5px;
	}
</style>
