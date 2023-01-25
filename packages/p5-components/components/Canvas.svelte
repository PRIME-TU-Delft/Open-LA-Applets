<script lang="ts">
  /**
   * Dragging marker over an image to transform it.
   */
  import { P5 } from 'p5-svelte';
  import type p5 from 'p5';

  let clientHeight;
  let clientWidth;

  const sketch = (p5: p5) => {
    p5.setup = () => {
      p5.createCanvas(clientWidth, clientHeight);
    };

    p5.draw = () => {
      p5.resizeCanvas(clientWidth, clientHeight);
      p5.line(100, 100, 200, 200);
    };

    // If the user presses/releases their mouse, signal this to all Draggable points
    p5.mousePressed = () => {
      console.log('todo');
    };

    p5.mouseReleased = () => {
      console.log('todo');
    };
  };
</script>

<div bind:clientHeight bind:clientWidth style="height: 100%">
  <P5 {sketch}>
    <slot />
  </P5>
</div>
