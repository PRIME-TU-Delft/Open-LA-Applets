<script lang="ts">
  import { Canvas2D, Line2D, Point2D } from 'p5-components';

  let m = { x: 200, y: 200 };

  let mouseIsDown = false;
  let zoom = 1;

  function handleMousemove(event: MouseEvent) {
    if (!mouseIsDown) return;
    m.x = event.clientX;
    m.y = event.clientY;
  }
  function handleTouchmove(event: TouchEvent) {
    m.x = event.touches[0].clientX;
    m.y = event.touches[0].clientY;
  }
</script>

<div
  style="height:100%;"
  on:mousedown={() => (mouseIsDown = true)}
  on:mouseup={() => (mouseIsDown = false)}
  on:mousemove={handleMousemove}
  on:touchmove={handleTouchmove}
>
  {zoom.toFixed(2)}
  <button on:click={() => (zoom /= 1.1)}>zoom out</button>
  <button on:click={() => (zoom *= 1.1)}>zoom in</button>

  <Canvas2D {zoom}>
    <Line2D start={[100, 100]} end={[m.x, m.y]} />
    <Point2D position={[m.x, m.y]} radius={10} pulse />
  </Canvas2D>
</div>
