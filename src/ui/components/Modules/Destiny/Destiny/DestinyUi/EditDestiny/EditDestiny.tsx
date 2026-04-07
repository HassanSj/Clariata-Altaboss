import { Modal, Box, Typography, Card, Grid, createStyles, makeStyles, Theme, Backdrop, Fade, Button, Collapse, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { style } from '@material-ui/system';
import { AxiosResponse } from 'axios';
import { useStoreState } from 'easy-peasy';
import React, { Dispatch, FC, ReactElement, SetStateAction, useEffect, useState } from 'react';
import api from '~/services/api';
import useNotifications from '~/ui/hooks/useNotifications';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            width: 70 + '%',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

interface props {
    personId: number | undefined;
    plans: any[];
    familyName: string | undefined;
    callback: () => any
    updateItemCallback: () => any
}

const EditDestiny: FC<props> = ({ updateItemCallback, callback, familyName, plans, personId }) => {

    let p: any;
    plans.find((d) => {
        d.PersonID == personId ? p = d.PlanMemberID : null
    })

    const [planMemberID, setPlanMemberID] = useState<number>(p)

    const notifications = useNotifications();
    const [open, setOpen] = React.useState(true);
    const [openExpanded, setOpenExpanded] = React.useState(true);
    const { destinyGlobalItems } = useStoreState(state => state.destiny);
    const classes = useStyles();
    const [expanded, setExpanded] = useState<boolean>(false)
    const [currentCategory, setCurrentCategory] = useState<number>()

    const handleOpen = () => {
        setOpen(true);
    };

    // useEffect(() => {

    // },[personId])

    const handleExpanded = (i: number) => {
        if (currentCategory != i) {
            setOpenExpanded(true)
            setCurrentCategory(i);
        } else {
            setOpenExpanded(!openExpanded)
            setCurrentCategory(i);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const addItems = async (itemID: number) => {
        const dd: AxiosResponse = await api.planmember.addPlanMemberItem({ DestinyItemID: itemID, IsAdvisorItem: 0, IsComplete: 0, PlanMemberID: planMemberID, CompletedDate: "2022-05-16T12:42:33.158Z" })
    }

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={() => {
                    // callback()
                    // handleClose()
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <Typography style={{ fontWeight: 'bolder' }} variant="h4" component="h4">
                            {familyName ? familyName : null} Edit Modal
                        </Typography>
                        <br /><br />
                        <Grid container spacing={1}>
                            <Grid md={8}>
                                <List
                                    component="div"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    {destinyGlobalItems?.map((data: any, index: number) => {
                                        return (
                                            <>
                                                <Divider />
                                                <ListItem onClick={() => handleExpanded(index)}>
                                                    <ListItemText primary={data.Category} />
                                                    {index == currentCategory && openExpanded ? <ExpandLess /> : <ExpandMore />}
                                                </ListItem>
                                                <Collapse in={index == currentCategory && openExpanded ? true : false} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        <ListItem button className={"list_hover "} key={index}>
                                                            <ListItemText primary={data.Title} />
                                                            <Button className="clr_white" onClick={() => {
                                                                addItems(data.ItemId)
                                                                updateItemCallback()
                                                            }}>Add</Button>
                                                        </ListItem>
                                                    </List>
                                                </Collapse>
                                            </>
                                        )
                                    })}
                                </List>
                            </Grid>
                            <Grid style={{ position: 'relative' }} md={4} >
                                <Button onClick={() => { callback() }} className='style_close' >Close</Button>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}
export default EditDestiny