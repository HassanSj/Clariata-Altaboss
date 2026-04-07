export const navigations: NavigationItem[] = [
  {
    id: 1,
    name: 'Selected Household',
    subitems: [
      {
        id: 1,
        name: 'Dashboard',
        icon: 'home',
        path: '/dashboard',
      },
      {
        id: 2,
        name: 'Priorities',
        icon: 'attach_money',
        path: '/priorities',
      },
      {
        id: 3,
        name: 'Action Steps',
        icon: 'done_all',
        path: '/tasks',
      },
      {
        id: 4,
        name: 'Contacts',
        icon: 'perm_contact_calendar',
        path: '/contacts',
      },
    ],
  },
  {
    id: 2,
    name: 'Manage',
    subitems: [
      {
        id: 1,
        name: 'Households',
        icon: 'family_restroom',
        path: '/dashboard',
      },
      {
        id: 2,
        name: 'Evaluations',
        icon: 'attach_money',
        path: '/evaluations',
      },

    ],
  },
  {
    id: 3,
    name: 'Settings',
    subitems: [
      {
        id: 1,
        name: 'Organization',
        icon: 'business',
        path: '/settings',
      },
      {
        id: 2,
        name: 'Settings',
        icon: 'settings',
        path: '/settings',
      },

    ],
  },
];

export const assignKeys = (items: NavigationItem[]) => {
  let index = 0;
  items.forEach((item: NavigationItem) => {
    item.id = index;
    item = assignItemKeys(item);
    index++;
  });
};

export const assignItemKeys = (item: NavigationItem) => {
  if (!item.subitems) {
    return item;
  }
  let index = 0;
  item.subitems.forEach((subitem: NavigationItem) => {
    item.id = index;
    item = assignItemKeys(item);
    index++;
  });

  return item;
};

export enum NavigationTab {
  HOME,
  CONTACTS,
  PROFILE,
  REPORTS,
  DIRECTION_PRIORITIES,
  DEEPEN,
  CONTACT,
}

export const NavigationTabs = {
  [NavigationTab.HOME]: {
    label: 'Home',
    route: '/dashboard',
    tab: 0
  },
  [NavigationTab.CONTACTS]: {
    label: 'Contacts',
    route: '/contacts',
    tab: 1
  },
  [NavigationTab.PROFILE]: {
    label: 'Family Details',
    route: '/profile',
    tab: 2
  },
  [NavigationTab.REPORTS]: {
    label: 'Report Manager',
    route: '/reports',
    tab: 3
  },
  [NavigationTab.DIRECTION_PRIORITIES]: {
    label: 'Priorities',
    route: '/direction/priorities',
    tab: 4
  },
  [NavigationTab.DEEPEN]: {
    label: 'Deepen',
    route: '/deepen',
    tab: 5
  },
  [NavigationTab.CONTACT]: {
    label: 'Contact',
    route: '/contact',
    tab: 6
  },
}

export enum DirectionNavigationTab {
  PRIORITIES,
  TASKS,
}

export const DirectionNavigationTabs = {
  [DirectionNavigationTab.PRIORITIES]: {
    label: 'Priorities',
    route: '/priorities',
    tab: 0
  },
  [DirectionNavigationTab.TASKS]: {
    label: 'Action Steps',
    route: '/tasks',
    tab: 1
  },
}

export enum AdminNavigationTab {
  HOME,
  FIRMS,
  GLOBAL_ITEMS,
  SUBCATEGORIES,
  RESOURCES,
  CHECKLISTS,
}

export const AdminNavigationTabs = {
  [AdminNavigationTab.HOME]: {
    label: 'Home',
    route: '/admin',
    tab: 0
  },
  [AdminNavigationTab.FIRMS]: {
    label: 'Firms',
    route: '/admin/firms',
    tab: 2
  },
  [AdminNavigationTab.GLOBAL_ITEMS]: {
    label: 'Destiny Global Items',
    route: '/admin/destiny',
    tab: 3
  },
  [AdminNavigationTab.SUBCATEGORIES]: {
    label: 'Destiny Subcategories',
    route: '/admin/subcategories',
    tab: 4
  },
  [AdminNavigationTab.RESOURCES]: {
    label: 'Resources',
    route: '/admin/resources',
    tab: 5
  },
  [AdminNavigationTab.CHECKLISTS]: {
    label: 'Checklists',
    route: '/admin/checklists',
    tab: 6
  },
}
