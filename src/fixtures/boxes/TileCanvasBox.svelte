<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs, context } = getTileContext();

	$: if ($context) {
		const ctx = $context;

		const dpr = window.devicePixelRatio || 1;

		ctx.beginPath();
		ctx.fillStyle = '#dedede';
		ctx.strokeStyle = '#cccccc';
		ctx.lineWidth = 1 * dpr;
		ctx.rect(0, 0, $specs.width * dpr, $specs.height * dpr);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
</script>
