import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type LocalizedString = {
  en: string;
  [languageCode: string]: string;
};

export function getLocalizedString(
  localizedString: LocalizedString | string | undefined,
  lang: string | null | undefined
): string | undefined {
  if (localizedString === undefined) return undefined;
  if (typeof localizedString == 'string') return localizedString;

  return localizedString[lang || 'en'] || localizedString.en;
}

export function getLanguages(localizedString: LocalizedString | undefined): string[] {
  if (!localizedString) return ['en', 'nl'];

  return Object.keys(localizedString);
}
