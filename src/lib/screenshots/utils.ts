/**
 * Generates screenshot file name from applet route
 * @param {string} route route to the applet, e.g. /applet/complex_basics/complex_addition
 * @returns Screenshot file name for the applet on this route
 */
export function getScreenshotName(route: string, withFolder: boolean = true) {
  if (!withFolder) {
    return route.replace('/applet/', '') + '/image.png';
  }

  return 'applet/' + route.replace('/applet/', '') + '/image.png';
}
