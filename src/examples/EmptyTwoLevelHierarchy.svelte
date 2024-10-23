<script lang="ts">
	import type {
		TypeTilePropsElement,
		TypeTilePropsType,
	} from '$lib/types/tileProps.type';

	import Tile from '$lib/components/Tile.svelte';

	interface Props {
		type: TypeTilePropsType;
	}

	let { type }: Props = $props();

	let outerElement: TypeTilePropsElement | undefined = $state();
	let innerElement: TypeTilePropsElement | undefined = $state();

	export function getOuterElement() {
		return outerElement;
	}

	export function getInnerElement() {
		return innerElement;
	}
</script>

<Tile width="100px" height="100px" {type} bind:element={outerElement}>
	<Tile width="80px" height="60px" {type} bind:element={innerElement} />
</Tile>
