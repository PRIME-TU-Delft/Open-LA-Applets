<script>
  const modules = import.meta.glob('./**/*.svelte');

  import ParagraphIndex from '$lib/ParagraphIndex.svelte';
</script>

<ParagraphIndex chapter="geom_lin_trans" {modules} />
