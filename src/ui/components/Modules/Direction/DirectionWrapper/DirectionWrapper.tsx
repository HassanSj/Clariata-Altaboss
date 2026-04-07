import {NavigationTab, NavigationTabs} from "~/ui/constants/navigations";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import styles from "./DirectionWrapper.module.scss";
import {Tab, Tabs} from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import {useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import Button from "~/ui/components/Button";

interface IProps {
  tab: NavigationTab,
  children: any;
  hideHeader?: boolean;
}

const DirectionWrapper = ({ tab, children, hideHeader = true }: IProps) => {
  const router = useRouter();

  // Tabs
  const selectedTab = () => {
    let result: number = -1;
    for (const [key, value] of Object.entries(NavigationTabs)) {
      if (value.route.includes(router.pathname)) {
        result = value.tab;
        break;
      }
    }
    return result;
  }
  const isActive = (nav: NavigationTab) => {
    return Boolean(NavigationTabs[nav].route.includes(router.pathname));
  }
  const selectTab = (nav: NavigationTab) => {
    return router.push(NavigationTabs[nav].route);
  }

  return (
    <div>
      { !hideHeader ?
      <>
        <Card>
          <CardContent>
            <div className={classnames("card-header-image",styles.header_bg)}></div>
            <div style={{textAlign: "right", marginLeft: "20px"}}>
                <Button text="Resources" color="primary" size="large" variant="contained" />
            </div>
            <div className={styles.footer}>
              <Tabs
                className={classnames(styles.tabs)}
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="disabled tabs example"
                value={selectedTab()}
                centered={true}>
                <Tab id="nav-tab-1"
                     label="Priorities"
                     key={NavigationTabs[NavigationTab.DIRECTION_PRIORITIES].tab}
                     value={NavigationTabs[NavigationTab.DIRECTION_PRIORITIES].tab}
                     onClick={() => selectTab(NavigationTab.DIRECTION_PRIORITIES)}
                     selected={paths.DIRECTION_PRIORITIES === router.asPath}/>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        <br />
      </>
      : null }
      {children}
    </div>
  )
}

export default DirectionWrapper;
