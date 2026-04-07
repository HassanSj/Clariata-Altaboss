import React, {ReactElement} from 'react';
import styles from './SimpleTabs.module.scss';
import classnames from "classnames";
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box'
import {Grid, ListItem, ListItemIcon, ListItemText, Paper} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}>
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export const a11yProps = (index: any) => {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

const SimpleTabs = (): ReactElement => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  // Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div>
      <Paper square>
        <Tabs
          className={classnames(styles.tabs)}
          value={value}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          onChange={handleChange}
          aria-label="disabled tabs example"
          centered>
          <Tab label="Contact"  {...a11yProps(0)}/>
          <Tab label="Education"  {...a11yProps(1)}/>
          <Tab label="Family"  {...a11yProps(2)}/>
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography color="textSecondary" gutterBottom>
              Religion
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <Icon>local_library</Icon>
              </ListItemIcon>
              <ListItemText>
                Catholic
              </ListItemText>
            </ListItem>
            <Typography color="textSecondary" gutterBottom>
              Contact
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <Icon>location_on</Icon>
              </ListItemIcon>
              <ListItemText>
                23 Skyland Drive.<br />
                Grenville, SC  29607<br />
                <span className={styles.address_label}>Home</span>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Icon>settings_phone</Icon>
              </ListItemIcon>
              <ListItemText primary="864-444-9226" secondary="Mobile" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Icon>alternate_email</Icon>
              </ListItemIcon>
              <ListItemText primary="jordan@email.com" secondary="Email" />
            </ListItem>
          </Grid>
          <Grid item xs={8}>
            <Typography color="textSecondary" gutterBottom>
              Marriage
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <Icon>family_restroom</Icon>
              </ListItemIcon>
              <ListItemText>
                Married to <a>Joan Smith</a><br />
                <span className={styles.address_label}>on 06/05/2008</span>
              </ListItemText>
            </ListItem>
            <Typography color="textSecondary" gutterBottom>
              Family
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <Icon>group</Icon>
              </ListItemIcon>
              <ListItemText>
                Mitch Allen<br />
                <span className={styles.address_label}>Brother</span>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Icon>group</Icon>
              </ListItemIcon>
              <ListItemText>
                Mitch Allen<br />
                <span className={styles.address_label}>Brother</span>
              </ListItemText>
            </ListItem>
            <Typography color="textSecondary" gutterBottom>
              Education
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <Icon>school</Icon>
              </ListItemIcon>
              <ListItemText>
                Bachelors in Finance, Coastal Carolina University<br />
                <span className={styles.address_label}>09/02/2006</span>
              </ListItemText>
            </ListItem>
            <Typography color="textSecondary" gutterBottom>
              Work
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <Icon>work</Icon>
              </ListItemIcon>
              <ListItemText>
                Lead Developer, MAC Interactive<br />
                <span className={styles.address_label}>09/02/2006 - 09/02/2006</span><br />
                <Typography variant="caption" gutterBottom>
                  This is fake text. This is fake text.This is fake text.This is fake text.This is fake text.This is fake text.This is fake text.This is fake text.
                </Typography>
              </ListItemText>
            </ListItem>
          </Grid>

        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item 2
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item 3
      </TabPanel>
    </div>
  );
};

export default SimpleTabs;
