<script lang="ts">
	import { getTileContext } from '$lib';

	const { specs, element } = getTileContext();

	$: if ($element) {
		const context = ($element as HTMLCanvasElement).getContext('2d');

		if (context) {
			context.fillStyle = '#dedede';
			context.strokeStyle = '#cccccc';
			context.rect(0, 0, $specs.width, $specs.height);
			context.fill();
			context.stroke();
		}
	}
</script>
