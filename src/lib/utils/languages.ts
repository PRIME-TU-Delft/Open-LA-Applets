// Import all language files once
const uiModules = import.meta.glob('../../lang/*/ui.json', { eager: true });
const appletModules = import.meta.glob('../../lang/*/applets.json', { eager: true });

/**
 * Dynamically discover available languages from the lang directory
 * by checking both ui.json and applets.json files
 */
function getAvailableLanguages(): string[] {
  // Extract available languages from ui.json file paths
  const uiLanguages = Object.keys(uiModules)
    .map((path) => path.match(/\.\.\/\.\.\/lang\/(.+?)\/ui\.json/)?.[1])
    .filter((lang): lang is string => !!lang);

  // Extract available languages from applets.json file paths
  const appletLanguages = Object.keys(appletModules)
    .map((path) => path.match(/\.\.\/\.\.\/lang\/(.+?)\/applets\.json/)?.[1])
    .filter((lang): lang is string => !!lang);

  const allLanguages = [...new Set([...uiLanguages, ...appletLanguages])];

  return allLanguages.sort();
}

/**
 * Get available languages for a specific applet category
 * Returns languages that have UI translations + languages that have translations for the category
 *
 * @param category - The applet category (e.g., "basisdim", "crossproduct")
 * @returns Array of language codes that support this category
 */
export function getAvailableLanguagesForApplet(category: string): string[] {
  const supportedLanguages = new Set<string>();

  Object.keys(appletModules).forEach((key) => {
    const langMatch = key.match(/\.\.\/\.\.\/lang\/(.+?)\/applets\.json/)?.[1];
    if (!langMatch) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module = appletModules[key] as any;
    const translations = module?.default;

    // Check if this language has any translations for the category
    if (translations?.[category]) {
      supportedLanguages.add(langMatch);
    }
  });

  // Always include languages that have UI translations (for the general UI)
  Object.keys(uiModules).forEach((key) => {
    const langMatch = key.match(/\.\.\/\.\.\/lang\/(.+?)\/ui\.json/)?.[1];
    if (langMatch) {
      supportedLanguages.add(langMatch);
    }
  });

  return Array.from(supportedLanguages).sort();
}

export { uiModules, appletModules };
export const availableLanguages = getAvailableLanguages();
