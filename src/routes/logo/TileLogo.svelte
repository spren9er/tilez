<script lang="ts">
  import { getTileContext } from '$lib';

  interface Props {
    fill?: boolean;
  }

  let { fill = true }: Props = $props();

  const { xScale, yScale } = getTileContext();
</script>

<rect
  x={0}
  y={0}
  width={$xScale(1)}
  height={$yScale(1)}
  fill={fill ? '#adbac7' : 'none'}
  stroke="#242931"
  stroke-width="2"
/>
