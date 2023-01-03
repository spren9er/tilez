<script lang="ts">
	import { Tile, HTile, VTile } from '$lib';

	import type { TypeTilePropsMode } from '$lib/types/tileProps.type';

	import TileBox from './TileBox.svelte';

	const minWidth = 80;
	const maxWidth = 600;
	const minHeight = 60;
	const maxHeight = 400;
	const minInnerPadding = 2;
	const maxInnerPadding = 6;

	$: width = 100;
	$: height = 100;
	$: innerPadding = 10;
	$: outerPadding = innerPadding;
	let mode = 'sizing' as TypeTilePropsMode;

	let t = 0;

	function sin(min: number, max: number, period: number) {
		return 0.5 * (Math.sin(t / period) + 1) * (max - min) + min;
	}

	setInterval(() => {
		t += 0.05;
		if (t >= 12 * Math.PI) t = 0;
		width = sin(minWidth, maxWidth, 3);
		height = sin(minHeight, maxHeight, 2);
		innerPadding = Math.ceil(sin(minInnerPadding, maxInnerPadding, 3));
	}, 20);
</script>

<div id="wrapper">
	<div style="width: {width}px; height: {height}px; border: 1px solid #333333">
		{#key [width, height, innerPadding]}
			<HTile {width} {height} {innerPadding} {outerPadding} {mode} type="svg">
				<VTile hAlign="center">
					<HTile vAlign="center">
						<VTile hAlign="center">
							<HTile vAlign="center">
								<Tile width="70px">
									<TileBox />
								</Tile>
								<Tile>
									<TileBox />
								</Tile>
							</HTile>
							<HTile height="40px" vAlign="center">
								<Tile>
									<TileBox />
								</Tile>
								<Tile width="25%">
									<TileBox />
								</Tile>
							</HTile>
							<Tile height="40%" vAlign="center">
								<TileBox />
							</Tile>
						</VTile>
						<VTile hAlign="center">
							<Tile height="50%" vAlign="top">
								<TileBox />
							</Tile>
							<Tile height="50px" vAlign="bottom">
								<TileBox />
							</Tile>
						</VTile>
					</HTile>
					<HTile vAlign="center">
						<VTile>
							<HTile height="20px">
								<Tile width="80%">
									<TileBox />
								</Tile>
								<Tile>
									<TileBox />
								</Tile>
							</HTile>
							<HTile>
								<Tile width="30%">
									<TileBox />
								</Tile>
								<VTile width="30px" vAlign="center">
									<Tile height="70px">
										<TileBox />
									</Tile>
									<Tile>
										<TileBox />
									</Tile>
								</VTile>
								<Tile width="40%" hAlign="right" vAlign="bottom">
									<TileBox />
								</Tile>
							</HTile>
						</VTile>
						<Tile width="40px" height="40px" vAlign="center">
							<TileBox />
						</Tile>
						<VTile width="50px">
							<Tile>
								<TileBox />
							</Tile>
							<Tile height="60%">
								<TileBox />
							</Tile>
						</VTile>
					</HTile>
				</VTile>
				<VTile hAlign="center">
					<HTile vAlign="center">
						<VTile hAlign="center">
							<Tile height="40%" vAlign="center">
								<TileBox />
							</Tile>
							<HTile vAlign="center">
								<Tile hAlign="center">
									<TileBox />
								</Tile>
								<Tile width="40%" hAlign="center">
									<TileBox />
								</Tile>
							</HTile>
							<Tile height="70px" vAlign="center">
								<TileBox />
							</Tile>
						</VTile>
						<VTile width="50px" hAlign="center">
							<Tile vAlign="top">
								<TileBox />
							</Tile>
							<HTile height="60px" vAlign="center">
								<VTile width="70%" hAlign="right">
									<Tile height="40px" vAlign="center">
										<TileBox />
									</Tile>
									<Tile vAlign="center">
										<TileBox />
									</Tile>
								</VTile>
							</HTile>
							<Tile height="20%" vAlign="bottom">
								<TileBox />
							</Tile>
						</VTile>
						<VTile width="60%" hAlign="center">
							<HTile height="60px" vAlign="top">
								<VTile width="30%" hAlign="center">
									<Tile>
										<TileBox />
									</Tile>
									<Tile>
										<TileBox />
									</Tile>
									<Tile>
										<TileBox />
									</Tile>
								</VTile>
								<Tile width="70%" hAlign="center">
									<TileBox />
								</Tile>
							</HTile>
							<HTile height="50px" vAlign="center">
								<Tile width="80px" hAlign="center">
									<TileBox />
								</Tile>
								<Tile hAlign="center">
									<TileBox />
								</Tile>
								<Tile width="25%" hAlign="center">
									<TileBox />
								</Tile>
							</HTile>
							<HTile vAlign="center">
								<HTile width="80%" hAlign="left">
									<VTile>
										<Tile vAlign="center">
											<TileBox />
										</Tile>
										<Tile height="50%" vAlign="center">
											<TileBox />
										</Tile>
										<HTile height="40%" vAlign="center">
											<Tile hAlign="center">
												<TileBox />
											</Tile>
											<Tile width="40px" hAlign="center">
												<TileBox />
											</Tile>
										</HTile>
									</VTile>
								</HTile>
								<Tile width="20px" hAlign="right">
									<TileBox />
								</Tile>
							</HTile>
						</VTile>
					</HTile>
				</VTile>
			</HTile>
		{/key}
	</div>
</div>

<style>
	:global(html) {
		margin: 0;
		padding: 0;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	#wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
