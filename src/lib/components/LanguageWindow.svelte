<script lang="ts">
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog';
  import { _ } from 'svelte-i18n';
  import { Button } from './ui/button';
  import { cn } from '$lib/utils';
  import type { LanguageInfo } from '$lib/utils/languages';

  export type LanguageWindowProps = {
    languages: LanguageInfo[];
    onclose: () => void;
  };

  const { languages, onclose }: LanguageWindowProps = $props();

  const defaultLangUrl = $derived.by(() => {
    const langUrl = new URL(page.url); // If this is not done here, searchParams.set will modify the original URL
    langUrl.searchParams.delete('lang');
    return langUrl.toString();
  });

  let langUrls: string[] = $derived.by(() => {
    return languages.map((l) => {
      const langUrl = new URL(page.url); // If this is not done here, searchParams.set will modify the original URL
      langUrl.searchParams.set('lang', l.code);
      return langUrl.toString();
    });
  });

  function getEmoji(lang: string) {
    if (lang === 'en') lang = 'gb';

    const regionalIndicatorEmoji: { [key: string]: string } = {
      a: '🇦',
      b: '🇧',
      c: '🇨',
      d: '🇩',
      e: '🇪',
      f: '🇫',
      g: '🇬',
      h: '🇭',
      i: '🇮',
      j: '🇯',
      k: '🇰',
      l: '🇱',
      m: '🇲',
      n: '🇳',
      o: '🇴',
      p: '🇵',
      q: '🇶',
      r: '🇷',
      s: '🇸',
      t: '🇹',
      u: '🇺',
      v: '🇻',
      w: '🇼',
      x: '🇽',
      y: '🇾',
      z: '🇿'
    };

    let res = '';
    for (let char of lang) {
      res += regionalIndicatorEmoji[char];
    }

    return res;
  }

  const activeLang = $derived(page.url.searchParams.get('lang') || 'default');

  /**
   * Get the translation note for a language
   * Returns empty string if both UI and applet are translated
   */
  function getTranslationNote(langInfo: LanguageInfo): string {
    if (langInfo.hasUI && langInfo.hasApplet) {
      return '';
    } else if (langInfo.hasUI && !langInfo.hasApplet) {
      return $_('language_ui_only');
    } else if (!langInfo.hasUI && langInfo.hasApplet) {
      return $_('language_applet_only');
    }

    return '';
  }
</script>

<Dialog.Content class="block sm:max-w-xl">
  <Dialog.Header>
    <Dialog.Title>{$_('language_window_title')}</Dialog.Title>
    <Dialog.Description class="flex flex-col gap-2">
      {$_('language_window_available')}

      <Button
        href={defaultLangUrl}
        onclick={onclose}
        variant="link"
        class={cn(
          'block bg-blue-300/20 hover:bg-blue-300/60',
          activeLang === 'default' && 'border-2 border-blue-500 font-bold hover:bg-blue-500/20'
        )}
      >
        🌍 Default
      </Button>

      {#each languages as langInfo, i (langInfo.code)}
        <Button
          href={langUrls[i]}
          onclick={onclose}
          variant="link"
          class={cn(
            'block bg-blue-300/20 hover:bg-blue-300/60',
            activeLang === langInfo.code &&
              'border-2 border-blue-500 font-bold hover:bg-blue-500/20'
          )}
        >
          {getEmoji(langInfo.code)}
          {langInfo.code.toUpperCase()}
          {#if getTranslationNote(langInfo)}
            <span class="ml-1 text-xs opacity-70">{getTranslationNote(langInfo)}</span>
          {/if}
        </Button>
      {/each}
    </Dialog.Description>
  </Dialog.Header>
</Dialog.Content>
