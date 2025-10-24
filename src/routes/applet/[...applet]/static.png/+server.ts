import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join, normalize } from 'path';

export const GET = async ({ params }: RequestEvent) => {
  const appletPath = params.applet;

  if (!appletPath) {
    throw error(400, 'Applet path is required');
  }

  const sanitizedPath = normalize(appletPath).replace(/^(\.\.(\/|\\|$))+/, '');

  const imagePath = join(process.cwd(), 'static', 'applet', sanitizedPath, 'static.png');

  try {
    const imageBuffer = await readFile(imagePath);

    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    throw error(404, {
      message: `Static image not found for applet: ${appletPath}`
    });
  }
};
