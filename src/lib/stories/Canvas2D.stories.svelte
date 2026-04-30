<script module>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector2 } from 'three';

  const { Story } = defineMeta({
    title: 'Initialize/Canvas2D',
    component: Canvas2D
  });
</script>

<script lang="ts">
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { onDestroy } from 'svelte';
  import type { CanvasProps } from '$lib/d3/CanvasType';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { FillType, LegendItem, Shape } from '$lib/utils/Legend';

  onDestroy(() => {
    globalState.title = '';
  });
</script>

{#snippet template(args: Omit<CanvasProps, 'children'>)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {...args}>
      <Vector2D direction={new Vector2(1, 2)} color={PrimeColor.blue} length={2} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="Default" {template} />

<!-- This canvas is zoomed out 2x by specifying cameraZoom=0.5 -->
<Story name="Zoom out" args={{ cameraZoom: 0.5 }} {template} />

<!-- This canvas is moved to x:3 and y:1 -->
<Story name="Camera position" args={{ cameraPosition: new Vector2(3, 1) }} {template} />

<!-- This canvas has a view box set, the area from (0,0) to (1,2), with a margin of 0.5, will be visible on any screen. -->
<Story
  name="View box"
  args={{ initialViewBox: new ViewBox(new Vector2(0, 0), new Vector2(1, 2), 0.5) }}
  {template}
/>

<!-- This applet has x and y axis labels defined -->
<Story
  name="With axis labels"
  args={{
    labels: {
      xLabel: 'x',
      yLabel: '\\text{error}'
    }
  }}
  {template}
/>

<!-- This canvas is smaller than the regular canvas. This can be useful in combination with `cameraZoom` -->
<Story name="Adjust tickLength" args={{ axis: { length: 5 } }} {template} />

<!-- This can be useful when you would like to show the applet at one specific location -->
<Story name="Toggle pan" args={{ enablePan: false }} {template} />

<!-- This can be useful when you would like to hide the axis numbers and put more attention to the applet.  -->
<Story
  name="Toggle Axis Numbers"
  args={{ axis: { showAxisNumbersX: false, showAxisNumbersY: false } }}
  {template}
/>

<!-- This story has a logarithmic Y axis -->
<Story name="Logarithmic axis">
  {#snippet template(_args)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        axis={{
          logarithmicY: true
        }}
      >
        <Vector2D direction={new Vector2(1, Math.log10(2))} color={PrimeColor.blue} />
      </Canvas2D>
    </div>
  {/snippet}
</Story>

<!-- This story has a scaled X axis -->
<Story name="Scaled axis">
  {#snippet template(_args)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        axis={{
          scaleX: 2
        }}
      >
        <Vector2D direction={new Vector2(2, 2)} color={PrimeColor.blue} length={2} />
      </Canvas2D>
    </div>
  {/snippet}
</Story>

<!-- This story has a skipped X ticks -->
<Story name="Skipped axis">
  {#snippet template(_args)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        axis={{
          skipX: 2
        }}
      >
        <Vector2D direction={new Vector2(2, 2)} color={PrimeColor.blue} length={2} />
      </Canvas2D>
    </div>
  {/snippet}
</Story>

<!-- 
This story showcases the position of the formula/legend (default is "top-right").
```typescript
legendFormulaPosition = "top-right" | "top-left" ;
```
 -->
<Story name="Formula/Legend position">
  {#snippet template(_args)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        legendItems={[
          new LegendItem('A', PrimeColor.blue),
          new LegendItem('B', PrimeColor.raspberry, Shape.Circle, FillType.Border),
          new LegendItem('C', PrimeColor.darkGreen, Shape.Circle, FillType.Dashed)
        ]}
        legendFormulaPosition="top-left"
      >
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={new Vector2(1, 1)}
          length={1}
          color={PrimeColor.blue}
        />
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={new Vector2(0, 1)}
          length={1}
          color={PrimeColor.raspberry}
        />
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={new Vector2(1, -1)}
          length={1}
          color={PrimeColor.darkGreen}
        />
      </Canvas2D>
    </div>
  {/snippet}
</Story>
