<script lang="ts">
  import { getTileContext } from '$lib/entities/tileContext';

  const { specs } = getTileContext();

  let width = $derived($specs.width >= 1 ? $specs.width - 1 : 0);
  let height = $derived($specs.height >= 1 ? $specs.height - 1 : 0);
</script>

<rect x={0.5} y={0.5} {width} {height} fill="#f5ac96" stroke="#8d4f3d" />
