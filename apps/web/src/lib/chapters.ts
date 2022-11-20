class Chapter {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  get formatName() {
    return this.name.replace(/_/g, ' ');
  }
}

export function getChapterList(
  module: Record<string, () => Promise<unknown>>,
  chapter: string
): Chapter[] {
  const modules = Object.keys(module);

  const modulesNames = modules.map((mdl) => mdl.split('/')[1]);

  return [...new Set(modulesNames)].map((mdl) => new Chapter(mdl, './' + chapter + '/' + mdl));
}

export function formatName(name: string) {
  const spaces = name.replace(/_/g, ' ');
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}
