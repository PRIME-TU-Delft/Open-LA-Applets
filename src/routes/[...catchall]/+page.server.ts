import type { PageServerLoad } from './$types';
import { loadBookAppletsUsage } from '$lib/server/bookApplets';

export const load: PageServerLoad = () => {
  return loadBookAppletsUsage();
};
