<script>
  import { Canvas2D } from '$lib/d3-components';
  import { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import LeftScene from './LeftScene.svelte';
  import RightScene from './RightScene.svelte';

  let controls = Controls.addSlider(
    0,
    0,
    1,
    0.1,
    PrimeColor.raspberry,
    'Animation left',
    () => ''
  ).addSlider(0, 0, 1, 0.1, PrimeColor.darkGreen, 'Animation right', () => '');
</script>

<Canvas2D bind:controls showAxisNumbers={false} splitCanvas2DProps={{ showAxisNumbers: false }}>
  {#key controls[0]}
    <LeftScene tick={controls[0]} />
  {/key}

  <svelte:fragment slot="splitCanvas">
    <RightScene />
  </svelte:fragment>
</Canvas2D>
