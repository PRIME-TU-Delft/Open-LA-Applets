<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { addMessages, init } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  // Localization
  const searchParams = new URLSearchParams(page?.url?.searchParams);
  const lang = searchParams.get('lang') || 'en';

  import en from './../lang/en.json';
  import nl from './../lang/nl.json';
  addMessages('en', en);
  addMessages('nl', nl);
  init({
    fallbackLocale: 'en'
  });
  locale.set(lang);

  let { children } = $props();
</script>

{@render children()}
