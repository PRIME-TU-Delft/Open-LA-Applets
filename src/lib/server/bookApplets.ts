import usage from '$lib/server/data/book-applets.json';

type AppletUsageEntry = {
  url: string;
  title: string;
  name: string;
  source_files: string[];
};

export type BookAppletUsage = {
  applets: AppletUsageEntry[];
};

export type AppletsUsageByBook = Record<string, BookAppletUsage>;

export function loadBookAppletsUsage(): AppletsUsageByBook {
  return usage as AppletsUsageByBook;
}
