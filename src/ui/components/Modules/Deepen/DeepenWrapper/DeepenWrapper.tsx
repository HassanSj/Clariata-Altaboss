import {NavigationTab, NavigationTabs} from "~/ui/constants/navigations";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {Tab, Tabs} from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import {useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import styles from "./DeepenWrapper.module.scss";

interface IProps {
  tab: NavigationTab,
  children: any;
  hideHeader?: boolean;
}

const DeepenWrapper = ({ tab, children, hideHeader = false }: IProps) => {
  const router = useRouter();

  // Tabs
  // const selectedTab = () => {
  //   let result: number = -1;
  //   for (const [key, value] of Object.entries(NavigationTabs)) {
  //     if (value.route.includes(router.pathname)) {
  //       result = value.tab;
  //       break;
  //     }
  //   }
  //   return result;
  // }
  // const isActive = (nav: NavigationTab) => {
  //   return Boolean(NavigationTabs[nav].route.includes(router.pathname));
  // }
  // const selectTab = (nav: NavigationTab) => {
  //   return router.push(NavigationTabs[nav].route);
  // }

  return (
    <div>
      { !hideHeader ?
        <>
          <Card>
            <CardContent>
              <div className={classnames("card-header-image",styles.header_bg)}></div>
              <div className={styles.footer}>
                
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

export default DeepenWrapper;
