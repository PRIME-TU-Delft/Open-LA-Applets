<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D } from 'threlte-components';

  import Docs from './docs.md';
</script>

<Story>
  <Canvas3D --height="100%" autoPlay={true}>
    <Axis3D axisLength={10} />
  </Canvas3D>

  <div slot="docs">
    <Docs />
  </div>
</Story>
