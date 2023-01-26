<script lang="ts">
  import { AbsoluteGrid, Axis2D, Canvas2D, Line2D, Point2D, RelativeGrid } from 'p5-components';

  let zoom = 1;
</script>

<div style="height:100%;">
  <div style="position: fixed; z-index: 1000">
    {zoom.toFixed(2)}
    <br />
    <button on:click={() => (zoom /= 1.1)}>zoom out</button>
    <button on:click={() => (zoom *= 1.1)}>zoom in</button>
  </div>

  <Canvas2D {zoom} let:mouseX let:mouseY>
    <Axis2D />
    <Line2D start={[0, 0]} end={[mouseX, mouseY]} color="red" width={3} />

    <RelativeGrid let:mouseX let:mouseY>
      <Line2D start={[0, 0]} end={[mouseX, mouseY]} color="green" width={2} />

      <Line2D start={[0, 0]} end={[100, 100]} />

      <AbsoluteGrid>
        <Line2D start={[0, 0]} end={[100, 100]} />
      </AbsoluteGrid>

      <Point2D position={[mouseX, mouseY]} radius={5} pulse />
    </RelativeGrid>
  </Canvas2D>
</div>
