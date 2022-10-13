<script lang="ts">
  import { MyCounterButton } from 'ui';

  import { Canvas3D, Axis3D, Vector3D } from 'visuals-3d';

  import { Vector3 } from 'three';
  import { Label } from 'visuals-3d/utils/label';
  // import { Preview } from 'mdi-svelte-ts';
</script>

<h1 class="text-3xl font-bold underline">Web</h1>
<MyCounterButton />

<Canvas3D --height="80vh">
  <Vector3D direction="{new Vector3(1, 1, 0)}" label="{new Label('x')}" />

  <Axis3D />
</Canvas3D>

<!-- <Preview /> -->

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
