import { redirect } from '@sveltejs/kit';

// Redirect this route to /hello
export function load() {
  throw redirect(302, './introduction');
}
