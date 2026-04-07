import React, { FC, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import EditIcon from '@material-ui/icons/Edit';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Button, Card, Select } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import { AxiosResponse } from 'axios';
import api from '~/services/api';
import onPopulate from '~/store/destiny/thunks/onPopulate';
import EditDestiny from '../EditDestiny/EditDestiny';
import useNotifications from '~/ui/hooks/useNotifications';
import DestinyPlanHeader from '../../../DestinyPlanHeader/DestinyPlanHeader';
import DestinyPlanDetails from '../../../DestinyPlanDetails/DestinyPlanDetails';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        remove_button: {
            margin: theme.spacing(1),
            backgroundColor: ' #ab1a32 !important',
            borderRadius: 4 + 'px',
            color: 'antiquewhite !important'
        }
    }),
);

interface prop {
    Author: string
    Category: string
    CompletedDate: string
    Description: string
    DestinyItemID: number
    Duration: string
    ImageUrl: string
    IsAdvisorItem: number
    IsComplete: number
    ItemType: null | any
    Location: string
    PersonID: number
    PlanMemberID: number
    PlanMemberItemID: number
    StartDate: string
    Subcategory: null | any
    Title: string
    Url: string
    UserId: number
}

const ShowPlanDetails: FC<prop | any> = ({ planDetails, updateCallback }) => {

    const classes1 = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = useState<boolean>(false)
    const { persons, selectedPerson } = useStoreState(state => state.person);
    const [currentCategory, setCurrentCategory] = useState<number>()
    const [planMemberId, setPlanMemberId] = useState<number>(planDetails ? planDetails[0]?.PlanMemberID : undefined)
    const [familyName, setFamilyName] = useState<string>()
    const [personId, setPersonId] = useState<number>()
    const classes = useRowStyles();
    let plansList: any = planDetails;

    const handleExpanded = (i: number) => {
        if (currentCategory != i) {
            setOpen(true)
            setCurrentCategory(i);
        } else {
            setOpen(!open)
            setCurrentCategory(i);
        }
    }

    const modalState = () => {
        setOpenModal(!openModal)
    }

    const deleteItems = async (planMemberItemID: number) => {
        try {
            await api.planmember.removePlanItems(planMemberItemID).then(() => {
                updateCallback()
            })
        } catch (error) {
            console.log('Error While removing planMemberItem');

        }

    }

    return (
        <>
            {
                persons ?
                    <>
                        {
                            persons.map((d: any, index: number) => {
                                return (
                                    <>
                                        {planDetails.some((x: any) => x.PersonID == d.PersonID && x.Category) ?
                                            < React.Fragment key={index}>
                                                <TableRow className={classes.root}>
                                                    <TableCell >
                                                        <IconButton size="small" onClick={() => handleExpanded(index)}>
                                                            {index == currentCategory && open ?
                                                                <KeyboardArrowUpIcon />
                                                                :
                                                                <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <b> {d.FullName}</b>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" align="right">
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="default"
                                                            className={classes1.button}
                                                            startIcon={< EditIcon />}
                                                            onClick={() => {
                                                                setOpenModal(prev => !prev)
                                                                setFamilyName(d.FullName)
                                                                setPersonId(d.PersonID)
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse
                                                            in={index == currentCategory && open ? true : false}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <Box margin={1}>
                                                                <Table size="small" aria-label="purchases">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell><b>Category</b></TableCell>
                                                                            <TableCell><b>Title</b></TableCell>
                                                                            <TableCell><b>Description</b></TableCell>
                                                                            <TableCell>&nbsp;&nbsp;<b>Actions</b></TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {planDetails ? planDetails.filter((j: any) => j.PersonID == d.PersonID).map((v: any, i: number) => {
                                                                            return (
                                                                                <>
                                                                                    <TableRow key={i} >
                                                                                        <TableCell component="th" scope="row">
                                                                                            {v.Category}
                                                                                        </TableCell>
                                                                                        <TableCell>{v.Title}</TableCell>
                                                                                        <TableCell>{v.Description}</TableCell>
                                                                                        <TableCell>
                                                                                            <Button
                                                                                                size="small"
                                                                                                variant="contained"
                                                                                                color="secondary"
                                                                                                className={classes1.remove_button}
                                                                                                startIcon={< DeleteIcon />}
                                                                                                onClick={() => { deleteItems(v.PlanMemberItemID) }}
                                                                                            >
                                                                                                Remove
                                                                                            </Button>
                                                                                        </TableCell>

                                                                                    </TableRow>
                                                                                </>
                                                                            )
                                                                        })
                                                                            : "No Data"
                                                                        }
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment >
                                            : null
                                        }
                                    </>
                                )
                            })
                        }
                        <div>
                            {openModal ?
                                <EditDestiny
                                    personId={personId}
                                    updateItemCallback={updateCallback}
                                    plans={planDetails}
                                    callback={modalState}
                                    familyName={familyName}
                                />
                                : null}

                        </div>
                    </>

                    : null
            }
        </>
    );
}

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: '#304256',
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

interface props {
    selectedDevPlanID: number | undefined
}

export const PlanDetailsTable: FC<props> = ({ selectedDevPlanID }) => {
    const notifications = useNotifications();
    const { persons, selectedPerson } = useStoreState(state => state.person);
    const { selectedHousehold, households } = useStoreState((state) => state.household);
    const { DevelopmentPlans } = useStoreState(state => state.destiny);
    const [planDetails, setPlanDetails] = useState<any[]>([])
    const [familyMemberID, setFamilyMemberID] = useState<number>()
    let items: AxiosResponse;

    const getItems = async () => {
        if (selectedDevPlanID) {
            await api.planmember.itemsListByHouseholdID(selectedHousehold.HouseholdID, selectedDevPlanID).then((d: any) => {
                setPlanDetails(d?.data)
            })
        }
    }

    const updateItemsCallback = () => {
        console.log('callback');
        getItems()
    }
    useEffect(() => {
        getItems()
    }, [selectedDevPlanID])

    useEffect(() => {
        setPlanDetails(planDetails)
    }, [planDetails])

    return (
        <>
            {selectedDevPlanID ?
                <Card>
                    <Box component="div" padding={'2%'}>
                        <div>
                            
                        </div> 
                        <div>
                            
                        </div>
                        <Typography variant="h6" gutterBottom component="div">
                            <b>{selectedHousehold ? selectedHousehold.HouseholdName : ''} Plan - {<>{DevelopmentPlans.filter((d: any) => d.DevelopmentPlanId == selectedDevPlanID).map((d: any) => d.Year)} </>}</b>
                        </Typography>
                        <div>
                        <Select className="select_dropDown"
                                value={familyMemberID}
                                label="Select family"
                                inputProps={{
                                    name: 'Select family',
                                    id: 'outlined-age-native-simple',
                                }}
                            >
                                <option value='None' id="none" selected={true} > Select Family Member </option>
                                {persons.map((data: any, index: number) => {

                                    return (<>
                                        <option value={data.PersonID}>{data.FullName}</option>
                                    </>)
                                })}
                            </Select>
                        </div>
                        <TableContainer >
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell />
                                        <StyledTableCell>Family Members</StyledTableCell>
                                        <StyledTableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>{
                                    planDetails != undefined && planDetails?.length ?
                                        <>
                                            {
                                                <ShowPlanDetails
                                                    updateCallback={updateItemsCallback}
                                                    planDetails={planDetails}
                                                />
                                            }
                                        </>
                                        : <TableRow >
                                            <StyledTableCell />
                                            <StyledTableCell>No records found</StyledTableCell>
                                            <StyledTableCell />
                                        </TableRow>
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box >
                </Card >
                : <div className='d_msg'>
                    Select Development year from the dropdown
                </div>
            }
        </>
    );
}
