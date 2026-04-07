import React from 'react';
import {cloneDeep} from 'lodash';
import {useRouter} from 'next/router';
import classnames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Icon from '@material-ui/core/Icon';
import Link from 'next/link';
import {useStoreActions, useStoreState} from '../../../store/hooks';
import {navigations} from '~/ui/constants/navigations';
import styles from './SideNav.module.scss';

interface NavItemProps {
  index: number;
  parentKey: string;
  classes: any;
  navState: any;
  list: any;
  item: any;
  handleClick: any;
  handleClickLink: any;
  nestLevel: number;
}

const NavItem = ({ index, parentKey, classes, navState, list, item, nestLevel, handleClick }: NavItemProps) => {
  const { isSideBarOpen } = useStoreState(state => state.layout);
  const router = useRouter();
  const nestLevelMultiplier = nestLevel + 1;
  const margin = `${nestLevelMultiplier * 15}px`;
  const key = `${parentKey}-${index}`;

  const setCurrentRoute = useStoreActions(actions => actions.layout.setCurrentRoute);

  const handleClickLink = (navItem: NavigationItem) => {
    if (!navItem.path) {
      return;
    }
    setCurrentRoute(navItem);
    router.push(navItem.path);
  };

  return (
    <div>
      {item.subitems != null ? (
        <div>
          <ListItem title={item.name} button key={key} onClick={() => handleClick(item)}>
            {item.icon && nestLevel === 0 ? (
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
            ) : null}
            <ListItemText hidden={!isSideBarOpen} primary={item.name} />
            {navState[item.name] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse key={list.subitems.id} component="li" in={navState[item.name]} timeout="auto" unmountOnExit>
            <List disablePadding style={{ paddingLeft: margin }}>
              {item.subitems.map((sitem: any, sindex: number) => {
                return (
                  <NavItem
                    key={`${key}-${sindex}`}
                    index={sindex}
                    parentKey={key}
                    classes={classes}
                    navState={navState}
                    list={list}
                    item={sitem}
                    nestLevel={nestLevelMultiplier}
                    handleClick={handleClick}
                    handleClickLink={handleClickLink}
                  />
                );
              })}
            </List>
          </Collapse>
        </div>
      ) : (
        <Link href={item.path}>
          <ListItem title={item.name} button onClick={() => handleClickLink(item)} key={key}>
            {item.icon && nestLevel === 0 ? (
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
            ) : null}
            <ListItemText hidden={!isSideBarOpen} primary={item.name} />
          </ListItem>
        </Link>
      )}
    </div>
  );
};

const SideNav = () => {
  const router = useRouter();
  const { isSideBarOpen, navigation } = useStoreState(state => state.layout);
  const toggleDrawer = useStoreActions(actions => actions.layout.toggleSideNav);
  const updateNavigation = useStoreActions(actions => actions.layout.setNavigation);

  const items = cloneDeep(navigations);
  const navState: { [key: string]: boolean } = navigation ? cloneDeep(navigation) : {};

  const handleClick = (e: any) => {
    navState[e.name] = !navState[e.name];
    updateNavigation(navState);
  };

  const handleClickLink = (item: any) => {
    router.push(item.path);
  };

  const handleMouseEnter = () => {
    if (!isSideBarOpen) toggleDrawer(true);
  };

  const handleMouseExit = () => {
    if (isSideBarOpen) toggleDrawer(false);
  };

  return (
    <Drawer
      variant="permanent"
      className={classnames(
        styles.drawer,
        { [styles.drawerOpen]: isSideBarOpen },
        { [styles.drawerClose]: !isSideBarOpen },
      )}
      classes={{
        paper: classnames({
          [styles.drawerOpen]: isSideBarOpen,
          [styles.drawerClose]: !isSideBarOpen,
        }),
      }}
      open={isSideBarOpen}
    >
      <div hidden={!isSideBarOpen} className={styles.toolbarIcon}>
        <IconButton onClick={() => toggleDrawer(false)}>
          <Icon>keyboard_arrow_left</Icon>
        </IconButton>
      </div>
      <Divider hidden={!isSideBarOpen} />
      <div>
        {items.map((list: any, index: number) => {
          return (
            <List
              className={styles.root}
              key={index}
              subheader={<ListSubheader hidden={!isSideBarOpen}>{list.name}</ListSubheader>}
            >
              {list.subitems.map((item: any, sindex: number) => {
                return (
                  <NavItem
                    key={`${index}-${sindex}`}
                    index={sindex}
                    parentKey={String(index)}
                    classes={styles}
                    navState={navState}
                    list={list}
                    item={item}
                    nestLevel={0}
                    handleClick={handleClick}
                    handleClickLink={handleClickLink}
                  />
                );
              })}
              <Divider key={list.id} absolute />
            </List>
          );
        })}
      </div>
    </Drawer>
  );
};

export default SideNav;
