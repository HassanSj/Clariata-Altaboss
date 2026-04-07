import { Modal, Box, Typography, Card, Grid, createStyles, makeStyles, Theme, Backdrop, Fade } from '@material-ui/core';
import { style } from '@material-ui/system';
import React, { FC, ReactElement, useState } from 'react';

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
    categoryName: string;
    item: string;
    itemDescription: string;
    isOpen: boolean;
    callback: () => any
}

export const AdvisorModal: FC<props> = ({ callback, categoryName, item, itemDescription, isOpen }) => {
    const [open, setOpen] = React.useState(true);
    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={() => {
                    callback()
                    handleClose()
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <Typography style={{fontWeight:'bolder'}} variant="h3" component="h3">
                            {categoryName}
                        </Typography>
                        <br /><br />
                        <Grid container md={8} direction="row" spacing={1}>
                            <br /><br />
                            <Grid md={3} >
                                <Typography style={{ fontWeight: '700' ,marginRight:4+'px'}} variant="h5" component="h5">
                                    {item}
                                </Typography>
                            </Grid>
                            <Grid md={9} sm={9}>
                                <Typography style={{ width: '45rem' }} variant="h5" component="p">
                                    &nbsp; {itemDescription}
                                </Typography>
                                <br /><br />
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}