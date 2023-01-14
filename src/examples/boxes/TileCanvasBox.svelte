<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs, context } = getTileContext();

	$: if ($context) {
		const ctx = $context;

		const dpr = window.devicePixelRatio || 1;
		const thickness = 1 * dpr;

		ctx.beginPath();
		ctx.fillStyle = '#eaeaea';
		ctx.strokeStyle = '#aaaaaa';
		ctx.lineWidth = thickness;
		ctx.rect(
			thickness / 2,
			thickness / 2,
			$specs.width * dpr - thickness,
			$specs.height * dpr - thickness,
		);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
</script>
