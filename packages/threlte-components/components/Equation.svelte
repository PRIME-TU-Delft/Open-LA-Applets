<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import { HTML } from '@threlte/extras';
  import { Vector3 } from 'three';

  export let latex: string = `no equation`;
  export let color: string = 'black';
  export let position: Vector3 = new Vector3(0, 0, 0);
  export let size: number = 1;
  export let offset: number = 0.25;

  let str = '';

  // Add offset in the direction of the vector
  $: pos =
    offset == 0
      ? position
      : position.clone().add(position.clone().normalize().multiplyScalar(offset));

  $: {
    // For reference: https://katex.org/docs/options.html
    str = katex.renderToString(latex, {
      displayMode: true,
      leqno: false,
      fleqn: false,
      throwOnError: true,
      errorColor: '#cc0000',
      strict: 'warn',
      output: 'mathml',
      trust: false,
      macros: { '\\f': '#1f(#2)' }
    });
  }
</script>

<HTML position={pos}>
  <div class="equation" style="color: {color}; font-size: {size}rem">{@html str}</div>
</HTML>

<style>
  .equation {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
</style>
