<script lang="ts">
	import { getSpecs } from '$lib';

	const specs = getSpecs();

	const format = (number: number) => Number(number).toFixed(0);
</script>

<div
	class="box"
	style="
			top: {$specs.absY}px;
			left: {$specs.absX}px;
			width: {$specs.width}px;
			height: {$specs.height}px;
		"
>
	<ul>
		<li><b>Width x Height</b></li>
		<li class="specs">{format($specs.width)} x {format($specs.height)}</li>
		<li><b>X / Y (rel.)</b></li>
		<li class="specs">{format($specs.relX)} / {format($specs.relY)}</li>
		<li><b>X / Y (abs.)</b></li>
		<li class="specs">{format($specs.absX)} / {format($specs.absY)}</li>
	</ul>
</div>

<style>
	.box {
		position: absolute;
		overflow: hidden;
		background-color: #efefef;
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
