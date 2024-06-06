<script lang="ts">
  import { Canvas2D } from '$lib/d3-components';
  import { Vector2 } from 'three';
  import BestlinesApplet from '../Bestlines_applet.svelte';

  //TODO camerazoom = 1.39
</script>

<Canvas2D splitCanvas2DProps={{ cameraPosition: new Vector2(4, 4) }}>
  <BestlinesApplet />
  <svelte:fragment slot="splitCanvas">
    <BestlinesApplet isOrthogonal={false} />
  </svelte:fragment>
</Canvas2D>
