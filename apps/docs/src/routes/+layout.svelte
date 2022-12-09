<script lang="ts">
  import { StoryLayout } from 'ui';
  import type DocsRoute from 'utils/DocsRoute';

  import '../app.css';

  export let routes: DocsRoute[] = [
    { url: 'introduction', name: 'Introduction' },
    { url: 'getting-started', name: 'Getting started' },
    {
      url: '3d-components',
      name: '3D Components',
      children: [
        { url: 'canvas', name: 'Canvas 3D' },
        { url: 'axis', name: 'Axis 3D' },
        { url: 'label', name: 'Label 3D' },
        { url: 'vector', name: 'Vector 3D' },
        { url: 'line', name: 'Line 3D' },
        { url: 'plane', name: 'Plane 3D' },
        { url: 'point', name: 'Point 3D' },
        { url: 'arc', name: 'Arc 3D' }
      ]
    },
    { url: '2d-components', name: '2D Components', children: [] },
    { url: 'ui', name: 'User interface', children: [] },
    {
      url: 'examples',
      name: 'Examples',
      children: [{ name: 'Colliding planes', url: 'colliding-planes' }]
    }
  ];
</script>

<StoryLayout {routes}>
  <slot />
</StoryLayout>
