<script lang="ts">
  import { Tile, HTile, VTile } from '$lib';

  import TileLogo from './TileLogo.svelte';

  const size = 64;
  const innerPadding = 4;
  const outerPadding = 4;

  const goldenRatio = 1.61803398875;
  const ratio = 1 - 1 / goldenRatio;
</script>

<HTile width={size} height={size} {innerPadding} {outerPadding} type="svg">
  <VTile width={ratio}>
    <Tile height={ratio}>
      <TileLogo />
    </Tile>
    <Tile>
      <TileLogo fill={false} />
    </Tile>
  </VTile>
  <VTile>
    <Tile height={ratio}>
      <TileLogo fill={false} />
    </Tile>
    <Tile>
      <TileLogo />
    </Tile>
  </VTile>
</HTile>
