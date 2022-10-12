<script lang="ts">
  import { MyCounterButton } from 'ui';

  import { Canvas3D, Axis } from 'visuals-3d';

  // import { Preview } from 'mdi-svelte-ts';
</script>

<h1 class="text-3xl font-bold underline">Web</h1>
<MyCounterButton />

<Canvas3D --height="50vh">
  <Axis />
</Canvas3D>

<!-- <Preview /> -->

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
