<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D } from 'visuals-3d';

  import Docs from './docs.md';
  import Code from './code.md';
</script>

<Story title="Simple canvas">
  <Canvas3D --height="100%" autoPlay="{true}" enablePan="{true}">
    <Axis3D />
  </Canvas3D>

  <div class="prose" slot="docs">
    <h1>Documentation</h1>
    <Docs />
  </div>

  <div class="prose" slot="code">
    <h1>Code sample</h1>
    <Code />
  </div>
</Story>
