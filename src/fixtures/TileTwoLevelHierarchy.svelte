<script lang="ts">
	import type {
		TypeTilePropsElement,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';

	import Tile from '$lib/components/Tile.svelte';

	export let type: TypeTilePropsType;

	let outerElement: TypeTilePropsElement;
	let innerElement: TypeTilePropsElement;

	export function getOuterElement() {
		return outerElement;
	}

	export function getInnerElement() {
		return innerElement;
	}
</script>

<Tile width="100px" height="100px" {type} bind:element={outerElement}>
	<Tile width="60px" height="80px" {type} bind:element={innerElement} />
</Tile>
