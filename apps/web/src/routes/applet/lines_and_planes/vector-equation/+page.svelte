<script lang="ts">
  import { Canvas2D, Line2D, Point2D } from 'p5-components';

  let m = { x: 200, y: 200 };

  let mouseIsDown = false;

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
  style="height:100%; color: green;"
  on:mousedown={() => (mouseIsDown = true)}
  on:mouseup={() => (mouseIsDown = false)}
  on:mousemove={handleMousemove}
  on:touchmove={handleTouchmove}
>
  {JSON.stringify(m)}
  <Canvas2D>
    <Line2D start={[100, 100]} end={[m.x, m.y]} />
    <Point2D position={[m.x, m.y]} radius={10} pulse />
  </Canvas2D>
</div>
