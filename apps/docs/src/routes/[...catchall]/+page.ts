import { redirect } from '@sveltejs/kit';

// Redirect all unknown routes to /introduction
// TODO: add warning that page did not exist
export function load() {
  throw redirect(302, '/introduction');
}
