<script lang="ts">
  import { onMount } from 'svelte';
  import type p5 from 'p5';

  // Component props
  export let sketch: (p5: p5) => void;
  export let parentDivStyle = 'display: block; height: 100%';

  let p5El: HTMLDivElement;

  function augmentClasses(instance: p5, classes): p5 {
    classes.forEach(([key, value]) => (instance[key] = value));
    return instance;
  }

  /**
   * When the client loads, create the p5 instance
   */
  onMount(async () => {
    const library = await import('p5');
    const { default: p5 } = library;

    const nativeClasses = Object.entries(library).filter(
      ([key, value]) => value instanceof Function && key[0] !== '_' && key !== 'default'
    );

    new p5((instance: p5) => {
      instance = augmentClasses(instance, nativeClasses);

      return sketch(instance);
    }, p5El);
  });
</script>

<div bind:this={p5El} style={parentDivStyle}>
  <slot />
</div>
