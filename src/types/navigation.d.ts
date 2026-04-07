declare interface NavigationItem {
  id: number;
  name?: string;
  type?: string;
  label?: string;
  icon?: string;
  iconText?: string;
  path?: string;
  badge?: {
    value: string;
    color: string;
  };
  auth?: string[];
  open?: boolean;
  toggleSidenav?: any;
  bgClass?: string;
  subitems?: NavigationItem[];
}
