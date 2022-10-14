<script lang="ts">
  import { StoryLayout } from 'ui';
  import type { Route } from 'util/Routes';

  import '../app.css';

  export let routes: Route[] = [
    { url: 'introduction' },
    { url: 'getting-started' },
    {
      url: '3d-components',
      children: [
        { url: 'canvas' },
        { url: 'axis' },
        { url: 'label' },
        { url: 'vector' },
        { url: 'line' },
        { url: 'plane' },
        { url: 'point' }
      ]
    },
    { url: '2d-components', children: [] },
    { url: 'UI', children: [] },
    { url: 'examples', children: [] }
  ];
</script>

<StoryLayout routes="{routes}">
  <slot />
</StoryLayout>
