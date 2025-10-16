// Import all language files once
const uiModules = import.meta.glob('../../lang/*/ui.json', { eager: true });
const appletModules = import.meta.glob('../../lang/*/applets.json', { eager: true });

export type LanguageInfo = {
  code: string;
  hasUI: boolean;
  hasApplet: boolean;
};

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
 * Get all available languages with both their translation status set to true
 *
 * @returns Array of all language info objects
 */
export function getAllLanguagesInfo(): LanguageInfo[] {
  return availableLanguages.map((code) => ({
    code,
    hasUI: true,
    hasApplet: true
  }));
}

/**
 * Get available languages for a specific applet with translation status
 * Returns languages that have UI translations + languages that have translations for the specific applet
 *
 * @param category - The applet category (e.g., "basisdim", "crossproduct")
 * @param appletName - The specific applet name (e.g., "more_languages")
 * @returns Array of language info objects with translation status
 */
export function getAvailableLanguagesForApplet(
  category: string,
  appletName: string
): LanguageInfo[] {
  const languageMap = new Map<string, LanguageInfo>();

  // Check for applet translations
  Object.keys(appletModules).forEach((key) => {
    const langMatch = key.match(/\.\.\/\.\.\/lang\/(.+?)\/applets\.json/)?.[1];
    if (!langMatch) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module = appletModules[key] as any;
    const translations = module?.default;

    // Check if this language has translations for the specific applet
    if (translations?.[category]?.[appletName]) {
      languageMap.set(langMatch, {
        code: langMatch,
        hasUI: false, // Will be updated below
        hasApplet: true
      });
    }
  });

  // Check for UI translations and update existing entries
  Object.keys(uiModules).forEach((key) => {
    const langMatch = key.match(/\.\.\/\.\.\/lang\/(.+?)\/ui\.json/)?.[1];
    if (!langMatch) return;

    const existing = languageMap.get(langMatch);
    if (existing) {
      existing.hasUI = true;
    } else {
      languageMap.set(langMatch, {
        code: langMatch,
        hasUI: true,
        hasApplet: false
      });
    }
  });

  return Array.from(languageMap.values()).sort((a, b) => a.code.localeCompare(b.code));
}

export { uiModules, appletModules };
export const availableLanguages = getAvailableLanguages();
export const DEFAULT_LANGUAGE = 'en';
