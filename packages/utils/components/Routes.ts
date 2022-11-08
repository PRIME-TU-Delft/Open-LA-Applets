export default interface Route {
  url: string;
  name: string;
  icon?: string;
  children?: Route[];
  isExpanded?: boolean;
}
