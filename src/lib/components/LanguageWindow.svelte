<script lang="ts">
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog';
  import { _ } from 'svelte-i18n';

  export type LanguageWindowProps = {
    languages: string[];
  };

  const { languages }: LanguageWindowProps = $props();

  let langUrls: string[] = [];

  languages.forEach((l) => {
    const langUrl = page.url;
    langUrl.searchParams.set('lang', l);
    langUrls.push(langUrl.toString());
  });

  function handleLanguageClick(url: string) {
    // force a refresh to update language
    window.location.href = url;
  }

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
</script>

<Dialog.Content class="block sm:max-w-xl">
  <Dialog.Header>
    <Dialog.Title>{$_('language_window_title')}</Dialog.Title>
    <Dialog.Description>
      {$_('language_window_available')}
      <ul class="list-disc">
        {#each languages as lang, i (lang)}
          <li class="ml-4">
            <a
              href={langUrls[i]}
              onclick={(e) => {
                e.preventDefault();
                handleLanguageClick(langUrls[i]);
              }}
            >
              {getEmoji(lang)}
              {lang.toUpperCase()}
            </a>
          </li>
        {/each}
      </ul>
    </Dialog.Description>
  </Dialog.Header>
</Dialog.Content>
