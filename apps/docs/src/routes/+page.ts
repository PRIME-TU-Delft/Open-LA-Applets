import { redirect } from '@sveltejs/kit';

// Redirect this route to /introduction
export function load() {
  throw redirect(302, './introduction');
}
