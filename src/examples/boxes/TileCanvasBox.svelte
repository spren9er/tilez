<script lang="ts">
	import { getTileContext } from '$lib/entities/tileContext';

	const { specs, context } = getTileContext();

	$effect(() => {
		if ($context) {
			const ctx = $context as CanvasRenderingContext2D;

			const dpr = window.devicePixelRatio || 1;
			const thickness = 1 * dpr;

			const offset = thickness / 2;
			const width = $specs.width * dpr - thickness;
			const height = $specs.height * dpr - thickness;

			if (width > 0 && height > 0) {
				ctx.beginPath();
				ctx.fillStyle = '#b5bfaf';
				ctx.strokeStyle = '#586254';
				ctx.lineWidth = thickness;
				ctx.rect(offset, offset, width, height);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
		}
	});
</script>
