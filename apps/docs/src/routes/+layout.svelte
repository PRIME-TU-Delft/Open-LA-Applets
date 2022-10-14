<script lang="ts">
  import { StoryLayout } from 'ui';
  import type { Route } from 'ui/components/stories/Routes'; // TODO: create util package

  import '../app.css';

  export let routes: Route[] = [
    { url: 'introduction' },
    { url: 'examples', children: [{ url: 'canvas' }] },
    { url: 'button' }
  ];
</script>

<StoryLayout routes="{routes}" home="stories">
  <slot />
</StoryLayout>
