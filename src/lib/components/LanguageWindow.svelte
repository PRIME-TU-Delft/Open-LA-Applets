<script lang="ts">
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog';

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
</script>

<Dialog.Content class="block sm:max-w-xl">
  <Dialog.Header>
    <Dialog.Title>Change language</Dialog.Title>
    <Dialog.Description>
      Languages available for this applet:
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
              {lang.toUpperCase()}
            </a>
          </li>
        {/each}
      </ul>
    </Dialog.Description>
  </Dialog.Header>
</Dialog.Content>
