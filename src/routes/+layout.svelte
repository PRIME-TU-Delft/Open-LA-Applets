<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { addMessages, init } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  // Localization
  const searchParams = new URLSearchParams(page?.url?.searchParams);
  const lang = searchParams.get('lang') || 'en';

  // Import UI translations
  import enUI from './../lang/en/ui.json';
  import nlUI from './../lang/nl/ui.json';
  
  // Import applet translations
  import enApplets from './../lang/en/applets.json';
  import nlApplets from './../lang/nl/applets.json';

  // Merge translations for each language
  addMessages('en', { ...enUI, applets: enApplets });
  addMessages('nl', { ...nlUI, applets: nlApplets });
  
  init({
    fallbackLocale: 'en'
  });
  locale.set(lang);

  let { children } = $props();
</script>

{@render children()}
