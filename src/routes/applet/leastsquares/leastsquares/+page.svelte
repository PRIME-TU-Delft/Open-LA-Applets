<script lang="ts">
  import { Canvas2D } from '$lib/d3-components';
  import { Vector2 } from 'three';
  import BestlinesApplet from '../Bestlines_applet.svelte';

  //TODO camerazoom = 1.39
</script>

<Canvas2D cameraPosition={new Vector2(4, 4)} cameraZoom={0.9}>
  <BestlinesApplet isLeastSquares={true} />
</Canvas2D>
