<script lang="ts">
  import { Vector2 } from 'three';
  import { select } from 'd3';

  import 'mathjax/es5/tex-svg';

  import { onMount } from 'svelte';

  export let latex: string = '';
  export let textSize: number = 13;
  export let position: Vector2 = new Vector2(0, 0);
  export let offset: Vector2 = new Vector2(0, 0);
  export let color: string = 'black';

  let latexWrapper: SVGGElement;

  onMount(() => {
    // @ts-ignore 2304 - MathJax is imported globally but cannot be found by TS
    select(latexWrapper).append(() => MathJax.tex2svg(latex).querySelector('svg'));
  });
</script>

<g
  bind:this={latexWrapper}
  fill={color}
  style="color: {color}"
  transform="translate({position.x + offset.x}, {position.y + offset.y}) scale({(0.02 / 16) *
    textSize} ,{(-0.02 / 16) * textSize})"
/>
