<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D } from 'visuals-3d';

  import Docs from './docs.md';
  import Code from './code.md';
</script>

<Story>
  <Canvas3D --height="100%" autoPlay="{true}" enablePan="{true}">
    <Axis3D />
  </Canvas3D>

  <div slot="docs">
    <Docs />
  </div>

  <div slot="code">
    <Code />
  </div>
</Story>
