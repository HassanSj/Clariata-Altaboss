import React from 'react';
import classnames from "classnames";
import styles from "./AdminWrapper.module.scss";
import paths from "~/ui/constants/paths";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Tab, Tabs} from '@material-ui/core';
import {isNullOrUndefined} from "~/ui/constants/utils";
import {AdminNavigationTab, AdminNavigationTabs} from "~/ui/constants/navigations";
import {useRouter} from "next/router";
import {useStoreActions, useStoreState} from "~/store/hooks";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";

interface IProps {
  tab: AdminNavigationTab,
  children: any;
}

const AdminWrapper = ({ children }: IProps) => {
  const router = useRouter();

  const { UserTypeID } = useStoreState((state) => state.user);

  // Tabs
  const selectedTab = () => {
    let result: number = -1;
    for (const [key, value] of Object.entries(AdminNavigationTabs)) {
      if (value.route.includes(router.pathname)) {
        result = value.tab;
        break;
      }
    }
    return result;
  }
  const selectTab = (nav: AdminNavigationTab) => {
    return router.push(AdminNavigationTabs[nav].route);
  }

  return (
    (UserTypeID == 1 ? 
      <>      
        <div>
          <Card>
            <CardContent>
              <div className={styles.footer}>
                <Tabs
                  className={classnames(styles.tabs)}
                  indicatorColor="secondary"
                  textColor="secondary"
                  aria-label="disabled tabs example"
                  value={selectedTab()}
                  centered={true}
                >
                  <Tab id="nav-tab-0"
                       label="Home"
                       key={AdminNavigationTabs[AdminNavigationTab.HOME].tab}
                       value={AdminNavigationTabs[AdminNavigationTab.HOME].tab}
                       onClick={() => selectTab(AdminNavigationTab.HOME)}
                       selected={paths.ADMIN_HOME === router.asPath}/>
                  <Tab id="nav-tab-1"
                       label="Firms"
                       key={AdminNavigationTabs[AdminNavigationTab.FIRMS].tab}
                       value={AdminNavigationTabs[AdminNavigationTab.FIRMS].tab}
                       onClick={() => selectTab(AdminNavigationTab.FIRMS)}
                       selected={paths.FIRMS === router.asPath}/>
                  <Tab id="nav-tab-3"
                       label="Destiny Items"
                       key={AdminNavigationTabs[AdminNavigationTab.GLOBAL_ITEMS].tab}
                       value={AdminNavigationTabs[AdminNavigationTab.GLOBAL_ITEMS].tab}
                       onClick={() => selectTab(AdminNavigationTab.GLOBAL_ITEMS)}
                       selected={paths.GLOBAL_ITEMS === router.asPath} />
                  <Tab id="nav-tab-4"
                       label="Subcategories"
                       key={AdminNavigationTabs[AdminNavigationTab.SUBCATEGORIES].tab}
                       value={AdminNavigationTabs[AdminNavigationTab.SUBCATEGORIES].tab}
                       onClick={() => selectTab(AdminNavigationTab.SUBCATEGORIES)}
                       selected={paths.SUBCATEGORIES === router.asPath} />
                  <Tab id="nav-tab-5"
                       label="Resources"
                       key={AdminNavigationTabs[AdminNavigationTab.RESOURCES].tab}
                       value={AdminNavigationTabs[AdminNavigationTab.RESOURCES].tab}
                       onClick={() => selectTab(AdminNavigationTab.RESOURCES)}
                       selected={paths.RESOURCES === router.asPath} />
                  <Tab id="nav-tab-6"
                       label="Checklists"
                       key={AdminNavigationTabs[AdminNavigationTab.CHECKLISTS].tab}
                       value={AdminNavigationTabs[AdminNavigationTab.CHECKLISTS].tab}
                       onClick={() => selectTab(AdminNavigationTab.CHECKLISTS)}
                       selected={paths.CHECKLISTS === router.asPath} />
                </Tabs>
              </div>
            </CardContent>
          </Card>
          <br />
          {children}
        </div>
    </>
    :
    <>
      <div>
        <h1>Unauthorized</h1>
      </div>
    </>
    )
  );
};

export default AdminWrapper;
