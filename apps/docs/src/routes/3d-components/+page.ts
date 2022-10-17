import { redirect } from '@sveltejs/kit';

// Redirect this route to /3d-components/canvas
export function load() {
  throw redirect(302, '/3d-components/canvas');
}
