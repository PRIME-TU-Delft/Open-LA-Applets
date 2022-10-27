<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D, Label3D } from 'visuals-3d';
  import { Vector3 } from 'three';

  import Docs from './docs.md';
  import Code from './code.md';
</script>

<Story>
  <Canvas3D --height="100%" autoPlay={true}>
    <Label3D position={new Vector3(2, 2, 2)} size={1} opacity={1} layer={undefined}>
      Super cool label
    </Label3D>

    <Axis3D />
  </Canvas3D>

  <div class="prose" slot="docs">
    <Docs />
  </div>

  <div class="prose" slot="code">
    <Code />
  </div>
</Story>
