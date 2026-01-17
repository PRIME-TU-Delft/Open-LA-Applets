/**
 * State for applet info
 */
class AppletState {
  URLParamsInfo: URLParamInfo[] = $state([]);
}

type URLParamInfo = {
  paramKey: string;
  defaultValue: string | number;
  description: string;
};

export const appletState = new AppletState();
