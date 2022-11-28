import { redirect } from '@sveltejs/kit';

// Redirect all unknown routes to /introduction
export function load() {
  throw redirect(302, '/introduction');
}
