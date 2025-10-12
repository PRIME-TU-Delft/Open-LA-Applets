<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { addMessages, init } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';
  import { availableLanguages, uiModules, appletModules } from '$lib/utils/languages';

  // Load translations for all languages
  availableLanguages.forEach((lang) => {
    const uiKey = Object.keys(uiModules).find((key) => key.includes(`/${lang}/ui.json`));
    const appletKey = Object.keys(appletModules).find((key) =>
      key.includes(`/${lang}/applets.json`)
    );

    if (!uiKey || !appletKey) {
      console.warn(`Missing translations for language: ${lang}`, { uiKey, appletKey });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ui = uiModules[uiKey] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applets = appletModules[appletKey] as any;

    if (ui?.default) {
      addMessages(lang, ui.default);
    }
    if (applets?.default) {
      addMessages(lang, { applets: applets.default });
    }
  });

  // Localization
  const searchParams = new URLSearchParams(page?.url?.searchParams);
  const lang = searchParams.get('lang') || 'en';

  init({
    fallbackLocale: 'en'
  });
  locale.set(lang);

  let { children } = $props();
</script>

{@render children()}
