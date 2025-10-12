<script lang="ts">
  import '../app.css';
  import { addMessages, init } from 'svelte-i18n';
  import { availableLanguages, uiModules, appletModules } from '$lib/utils/languages';

  // Load translations for all languages
  availableLanguages.forEach((lang) => {
    const uiKey = Object.keys(uiModules).find((key) => key.includes(`/${lang}/ui.json`));
    const appletKey = Object.keys(appletModules).find((key) =>
      key.includes(`/${lang}/applets.json`)
    );

    if (uiKey) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ui = uiModules[uiKey] as any;
      if (ui?.default) {
        addMessages(lang, ui.default);
      }
    }

    if (appletKey) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const applets = appletModules[appletKey] as any;

      if (applets?.default) {
        addMessages(lang, { applets: applets.default });
      }
    }
  });

  // Localization
  init({
    fallbackLocale: 'en'
  });

  let { children } = $props();
</script>

{@render children()}
