import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import styles from './VerticalTabs.module.scss';
import {Badge, Button, Chip, Grid, Icon} from "@material-ui/core";
import classnames from "classnames";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: '250px'
  },
}));

const a11yProps = (index: any) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const VerticalTabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const VerticalTabsTab = ({index, label, content, icon, badge}: TabProps) => {
  return (
    <>
      <Badge badgeContent={badge} color="error">
        <Box mr={1}>
          <Icon>{icon}</Icon>
        </Box>
        <Box mr={1}>
          {label}
        </Box>
      </Badge>
    </>
  )
}

export interface TabProps {
  index: number;
  label: string;
  content: any;
  icon?: string;
  check?: boolean;
  badge?: string | number;
  isDateWrong?: boolean;
}

export interface IVerticalTabsProps {
  tabs: TabProps[];
  onTabChange?:(index: number)=>void;
}

export default function VerticalTabs({tabs,onTabChange}: IVerticalTabsProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if(onTabChange)
      onTabChange(newValue);
  };

  const previous = () => {
    const total = tabs?.length;
    if (value > 0) {
      setValue(value - 1);
    }
  }

  const isPreviousAvailable = () => {
    return value > 0;
  }

  const next = () => {
    const total = tabs?.length;
    if (value < (total - 1)) {
      setValue(value + 1);
    }
  }

  const isNextAvailable = () => {
    const total = tabs?.length;
    return value < (total - 1);
  }

  return (
    <div>
      <div className={styles.tab_navigation}>
        <Grid container spacing={1}>
          <Grid container item xs={6} justifyContent="flex-start">
            <Button color="secondary"
                    disabled={!isPreviousAvailable()}
                    onClick={() => previous()}>
              <Icon className={styles.previous_icon}>keyboard_arrow_left</Icon> Previous
            </Button>
          </Grid>
          <Grid container item xs={6} justifyContent="flex-end">
            <Button color="secondary"
                    disabled={!isNextAvailable()}
                    onClick={() => next()}>
              Next   <Icon className={styles.next_icon}>keyboard_arrow_right</Icon>
            </Button>
          </Grid>
        </Grid>
      </div>
      <div className={classnames(classes.root, styles.tabs_wrapper)}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}>
          {tabs.map((tab: any, index: number) => (
            <Tab {...a11yProps(tab.index)}
                 key={index}
                 className={classnames(styles.tab, { [styles.tab_selected]: (value === tab.index)})}
                 label={
                   <React.Fragment>
                     {tab.label}
                     {tab.check ? <Chip size="small" color="secondary" label="&#10004;" className={styles.tab_count}/> : null}
                     {(tab?.badge && tab?.badge > 0) ?
                       <Chip className={styles.tab_count}
                             size="small"
                             color="secondary"
                             label={tab.badge}/>
                       : null}
                     {tab.isDateWrong ? <Chip size="small" color="secondary" label="&#10008;" className={styles.tab_count}/> : null}
                   </React.Fragment>
                 }/>
          ))}
        </Tabs>
        <div className={styles.tab_panel}>
          {tabs.map((tab: any, index: number) => (
            <VerticalTabPanel key={index}
                              value={value}
                              index={tab.index}>
              {tab.content}
            </VerticalTabPanel>
          ))}
        </div>
      </div>
    </div>
  );
}
