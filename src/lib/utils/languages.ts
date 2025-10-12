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

export { uiModules, appletModules };
export const availableLanguages = getAvailableLanguages();
