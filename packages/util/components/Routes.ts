export interface Route {
  url: string;
  icon?: string;
  children?: Route[];
  isExpanded?: boolean;
}
