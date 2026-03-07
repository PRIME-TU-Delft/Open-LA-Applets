import type { PageServerLoad } from './$types';

type AppletUsageEntry = {
  url: string;
  title: string;
  name: string;
  source_files: string[];
};

type BookAppletUsage = {
  applets: AppletUsageEntry[];
};

type AppletsUsageByBook = Record<string, BookAppletUsage>;

export const load: PageServerLoad = async ({ fetch }) => {
  let res;

  try {
    res = await fetch('/book-applets.json', {
      cache: 'force-cache'
    });
  } catch (_) {
    return {};
  }

  if (!res.ok) {
    return {};
  }

  const usage: AppletsUsageByBook = await res.json();

  return usage;
};
