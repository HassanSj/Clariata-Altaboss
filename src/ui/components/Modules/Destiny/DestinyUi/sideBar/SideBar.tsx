import { Box, Button, Divider, Grid, Icon, TextField } from "@material-ui/core";
import React, { ReactElement, ReactFragment, ReactNode } from "react";
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import styles from "./Destiny.module.scss";
import classnames from "classnames";

const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const SideBar = (): ReactElement => {
    const classes = useStyles();
    const [openGeneralDevelopment, setopenGeneralDevelopment] = React.useState(false);
    const [openGovernance, setopenGovernance] = React.useState(false);
    const [openFamilyLegacy, setopenFamilyLegacy] = React.useState(false);
    const [openNextGen, setopenNextGen] = React.useState(false);
    const [openPhilanthropy, setopenPhilanthropy] = React.useState(false);
    const [openSuccesion, setopenSuccesion] = React.useState(false);
    const [openOthers, setopenOthers] = React.useState(false);

    const handleClick1 = () => {
        setopenGeneralDevelopment(!openGeneralDevelopment);
    };
    const handleClick2 = () => {
        setopenGovernance(!openGovernance);
    };
    const handleClick3 = () => {
        setopenFamilyLegacy(!openFamilyLegacy);
    };
    const handleClick4 = () => {
        setopenNextGen(!openNextGen);
    };
    const handleClick5 = () => {
        setopenPhilanthropy(!openPhilanthropy);
    };
    const handleClick6 = () => {
        setopenSuccesion(!openSuccesion);
    };

    const handleClick7 = () => {
        setopenOthers(!openOthers);
    };

    return (
        <>
            <div className="sideBar_menu">
                <div>
                    <button className="create_plan_button">Create Plan</button>
                </div>
                <Box >
                    <Grid container spacing={1} >
                        <Grid item md={8}>
                            <input className="search" placeholder="Search" id="filled-size-normal"  />
                        </Grid>
                        <Grid item md={4}>
                            <div className="mt-1">
                                <button className="seacrh_button">Search</button>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <div>
                    <List 
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        // subheader={
                        //     <ListSubheader component="div" id="nested-list-subheader">
                        //         Nested List Items
                        //     </ListSubheader>
                        // }
                        className={classes.root}
                    >
                        <Divider />
                        <ListItem button onClick={handleClick1}>
                            <ListItemText primary="General Development " />
                            {openGeneralDevelopment ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openGeneralDevelopment} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={handleClick2}>
                            <ListItemText primary="Governance" />
                            {openGovernance ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openGovernance} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={handleClick3}>
                            <ListItemText primary="Family Legacy" />
                            {openFamilyLegacy ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openFamilyLegacy} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={handleClick4}>
                            <ListItemText primary="Next Generation" />
                            {openNextGen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openNextGen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={handleClick5}>
                            <ListItemText primary="Philanthropy" />
                            {openPhilanthropy ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openPhilanthropy} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={handleClick6}>
                            <ListItemText primary="Succesion" />
                            {openSuccesion ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openSuccesion} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={handleClick7}>
                            <ListItemText primary="Others" />
                            {openOthers ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openOthers} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested}>
                                    <Icon>add</Icon>&nbsp;&nbsp;
                                    <ListItemText primary="Starred" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </div>
            </div>
        </>
    )
}
export default SideBar