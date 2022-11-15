<script lang="ts">
  const modules = import.meta.glob('./**/*.svelte');

  import ParagraphIndex from '$lib/ParagraphIndex.svelte';
</script>

<ParagraphIndex chapter="applet" {modules} />
