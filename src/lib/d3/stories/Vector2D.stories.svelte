<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Vector2D from '../Vector2D.svelte';
  import { Vector2 } from 'three';
  import Latex2D from '../Latex2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Vector2D',
    component: Vector2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';
  import type { VectorProps } from '../Vector2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args: VectorProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <Vector2D {...args}>
        {#snippet children(endPoint)}
          <Latex2D latex={'\\vec{v}'} position={endPoint} extend={0.3} color={PrimeColor.black} />
        {/snippet}
      </Vector2D>
    </Canvas2D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Vector2D component. It displays a black vector
  starting from the origin (0, 0) and pointing in the positive x-direction with a length of 1 unit. -->
<Story
  name="Default"
  args={{
    color: PrimeColor.black,
    origin: new Vector2(0, 0),
    direction: new Vector2(1, 0),
    length: 1,
    radius: 0.02
  }}
/>

<!-- Colored Vector. This story demonstrates a vector with a custom color (raspberry). The vector starts at the origin
and points diagonally (1, 1) with a length of 1.5 units, showcasing how color can be used to
distinguish different vectors. -->
<Story
  name="Colored Vector"
  args={{
    color: PrimeColor.raspberry,
    origin: new Vector2(0, 0),
    direction: new Vector2(1, 1),
    length: 1.5,
    radius: 0.02
  }}
/>

<!-- Vector with Custom Origin.  This story illustrates a vector with a custom origin point (-1, -1). It shows how vectors can be
  positioned anywhere in the 2D space, not just at the default origin.
 -->
<Story
  name="Custom Origin"
  args={{
    color: PrimeColor.blue,
    origin: new Vector2(-1, -1),
    direction: new Vector2(1, 0),
    length: 2,
    radius: 0.02
  }}
/>

<!-- Thick Vector.This story presents a vector with increased thickness. The radius is set to 0.05, making the
  vector more prominent and demonstrating how the thickness can be adjusted for emphasis or
  visibility. -->
<Story
  name="Thick Vector"
  args={{
    color: PrimeColor.darkGreen,
    origin: new Vector2(0, 0),
    direction: new Vector2(0, 1),
    length: 1,
    radius: 0.05
  }}
/>

<!-- Dashed Vector.This story shows a dashed vector. The dashed appearance can be useful for representing temporary
  or projected vectors, or for distinguishing between different types of vectors in a diagram. -->
<Story
  name="Dashed Vector"
  args={{
    color: PrimeColor.orange,
    origin: new Vector2(0, 0),
    direction: new Vector2(3, 1),
    length: new Vector2(3, 1).length(),
    radius: 0.02,
    isDashed: true
  }}
/>

<!-- Vector without Head. This story displays a vector without an arrowhead. This representation can be useful when you want
  to show a line segment with direction but don't need to emphasize the vector nature with an arrow. -->
<Story
  name="Headless Vector"
  args={{
    color: PrimeColor.orange,
    origin: new Vector2(0, 0),
    direction: new Vector2(1, -1),
    length: 2,
    radius: 0.02,
    hideHead: true
  }}
/>

<!-- Non-normalized Vector. This story demonstrates a non-normalized vector. By setting noNormalise to true, the direction (3,
  4) is not normalized, resulting in a vector that points in the direction (3, 4) with a length of 1
  unit, rather than a unit vector in that direction. -->
<Story
  name="Non-normalized Vector"
  args={{
    color: PrimeColor.orange,
    origin: new Vector2(0, 0),
    direction: new Vector2(3, 1),
    length: 1,
    radius: 0.02,
    noNormalise: true
  }}
/>
