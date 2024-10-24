<script lang="ts">
  // @ts-nocheck
  import reglFactory from 'regl';

  import { getTileContext } from '$lib/entities/tileContext';

  const { specs, element, context } = getTileContext();

  let regl: reglFactory.Regl = $state();
  let draw: reglFactory.DrawCommand = $state();

  type ReglProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    fullWidth: number;
    fullHeight: number;
    dpr: number;
  };

  $effect(() => {
    if ($element && $context && !regl) {
      regl = reglFactory({ gl: $context as WebGLRenderingContext });

      draw = regl({
        frag: `
	        precision mediump float;

	        uniform float x;
	        uniform float y;
	        uniform float width;
	        uniform float height;
	        uniform float fullWidth;
	        uniform float fullHeight;
	        uniform float dpr;

	        void main () {
	          float xnorm = gl_FragCoord.x / dpr;
	          float ynorm = fullHeight - gl_FragCoord.y / dpr;
	          float thickness = 1.0;

	          if (
	            x + thickness <= xnorm && xnorm <= x + width - thickness &&
	            y + thickness <= ynorm && ynorm <= y + height - thickness
	          ) {
	            gl_FragColor = vec4(0.94, 0.80, 0.55, 1.0);
	          } else if (
	            x <= xnorm && xnorm <= x + width &&
	            y <= ynorm && ynorm <= y + height
	            ) {
	            gl_FragColor = vec4(0.54, 0.43, 0.20, 1.0);
	          } else {
	            discard;
	          }
	        }
	      `,
        vert: `
	        precision mediump float;
	        attribute vec2 position;

	        void main () {
	          gl_Position = vec4(position, 0.0, 1.0);
	        }
	      `,
        attributes: {
          position: [
            [-3, 0],
            [0, -3],
            [3, 3],
          ],
        },
        uniforms: {
          x: (_, props: ReglProps) => props.x,
          y: (_, props: ReglProps) => props.y,
          width: (_, props: ReglProps) => props.width,
          height: (_, props: ReglProps) => props.height,
          fullHeight: (_, props: ReglProps) => props.fullHeight,
          dpr: (_, props: ReglProps) => props.dpr,
        },
        count: 3,
        viewport: {
          x: 0,
          y: 0,
          width: (_, props: ReglProps) => props.fullWidth * props.dpr,
          height: (_, props: ReglProps) => props.fullHeight * props.dpr,
        },
      });
    }
  });

  $effect(() => {
    if ($element && $context && !!regl) {
      const dpr = window.devicePixelRatio || 1;
      const fullWidth = parseFloat($element.style.width);
      const fullHeight = parseFloat($element.style.height);

      draw({
        x: $specs.subRootX,
        y: $specs.subRootY,
        width: Math.round($specs.width),
        height: Math.round($specs.height),
        fullWidth: Math.round(fullWidth),
        fullHeight: Math.round(fullHeight),
        dpr,
      });
    }
  });
</script>
