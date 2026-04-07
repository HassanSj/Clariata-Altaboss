import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, createStyles, FormControl, Grid, InputLabel, makeStyles, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography, withStyles } from "@material-ui/core";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { FC, ReactElement, useEffect, useState } from "react";
import api from "~/services/api";
import useNotifications from "~/ui/hooks/useNotifications";
import { Alert } from "@material-ui/lab";

enum Categories {
    DREAM = 1,
    DISCOVER = 2
}

const useStyles = makeStyles({
    root: {
        maxWidth: 450,
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    inputField: {
        height: 2.6 + 'rem',
        fontSize: '16px',
        width: 7 + 'rem'
    },
    table: {
        minWidth: 700,
    }
});

interface Createprops {
    callback: (date: string | number) => any;
    year?: string | number;
    cancelCallback: () => void
}

const CreatePlan: FC<Createprops> = ({ cancelCallback, callback }) => {

    const notifications = useNotifications()
    const classes = useStyles();
    const [isShown, setIsShown] = useState<boolean>(false)
    const [date, setDate] = useState<number | string>(2022)


    return (
        <>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Create Plan
                    </Typography>
                    <Typography variant="body2" component="div">
                        <div>
                            Year: <input className={classes.inputField} type='number' defaultValue={date} onChange={(e) => setDate(e.target.value)} /> &nbsp;&nbsp;
                            <button className="create_plan_button" onClick={() => {
                                callback(date)
                                setIsShown(true)
                            }}>Create </button>
                            &nbsp;&nbsp;
                            <button onClick={cancelCallback} className="cancel_plan_button">Cancel</button>
                        </div>
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}

const DropdownStyling = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 350

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
interface Selectprops {
    SelectFamilycallback: (e: any) => any;
    resetCallback: () => any;
    year?: string | number;
    developmentPlanId: number | undefined;
}

const SelectFamilyMember: FC<Selectprops> = ({ developmentPlanId, resetCallback, SelectFamilycallback, year }) => {

    const notification = useNotifications()
    const { onPopulate, onSelectPerson, onSetAddedItems, setAddedItems, selectPerson }: any = useStoreActions(actions => actions.destiny)
    const { persons, selectedPerson } = useStoreState(state => state.person);
    const { selectedHousehold, households } = useStoreState((state) => state.household);

    const classes = DropdownStyling();
    const [familyMemberID, setFamilyMemberID] = useState<number>()

    const handleChange = (e: any) => {
        if (e.currentTarget.value != 'None' && e.currentTarget.value != '') {
            setFamilyMemberID(e.currentTarget.value)
        }
    }

    return (<>
        <div>
            <span className="family_name">{selectedHousehold ? selectedHousehold.HouseholdName + ' Family-' + year + ' Plan' : "No Household Selected"} </span>
            <br />
            <div className="flex_wrap_main">
                <div className="flex_wrap">
                    <span className="family_member">Family Members</span>
                    <span>
                        <FormControl variant="outlined" className={classes.formControl}>
                            {/* <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel> */}
                            <Select className="select_dropDown"
                                native
                                value={familyMemberID}
                                onChange={(e) => {
                                    handleChange(e)
                                    SelectFamilycallback(e)
                                }}
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
                        </FormControl>
                    </span>
                </div>
                <Button onClick={resetCallback}>Done</Button>
            </div>
        </div>
        <div>
            <ItemsAdded personId={familyMemberID} developmentplanID={developmentPlanId} />
        </div>
    </>)
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

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

interface itemsProps {
    personId: number | undefined;
    developmentplanID: number | undefined;
}

const ItemsAdded: FC<itemsProps> = ({ developmentplanID, personId }) => {

    const { selectedFamilyPerson, SelectedPersonItemsAdded } = useStoreState(state => state.destiny);
    // console.log('selectedFamilyPerson', selectedFamilyPerson);
    // console.log('SelectedPersonItemsAdded', SelectedPersonItemsAdded);

    const { selectedHousehold, households } = useStoreState((state) => state.household);
    const [developmentPlanID, setDevelopmentPlanID] = useState<number | undefined>(developmentplanID)
    const [personID, setPersonID] = useState<any>(personId)
    const [listData, setListData] = useState<any[]>([])
    // console.log('personID', personID);

    const classes = useStyles();
    const notification = useNotifications()
    const [globalItemsArray, setGlobalItemsArray] = useState<any[]>([])


    const getGlobalData = async () => {
        setGlobalItemsArray([])
        notification.toggleLoading(true)
        const destinyData: any = await api.destiny.getGlobalItems()
        destinyData?.data.map((d: any) => { setGlobalItemsArray(prev => [...prev, d.Category]) })
        notification.toggleLoading(false)
    }

    const getItemsList = async () => {
        try {
            const List: any = await api.planmember.itemsList(developmentPlanID, selectedHousehold.HouseholdID, personID)
            setListData(List.data)
            console.log('List=>', List);
        } catch (error) {
            console.log(error);
        }

    }


    useEffect(() => {
        setPersonID(personId)
        getGlobalData()
    }, [])

    useEffect(() => {
        setPersonID(personId)
    }, [personId])

    useEffect(() => {
        getItemsList()
    }, [personID])

    return (
        <>
            {
                globalItemsArray.map((d, i) => {
                    return (
                        <TableContainer component={Paper} key={i}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>{d}</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        SelectedPersonItemsAdded != null ?
                                            SelectedPersonItemsAdded.filter((x: any) => x.Category == d).map((j: any, i: number) => {
                                                return (
                                                    <>
                                                        <TableRow >
                                                            <StyledTableCell>{j.Title}</StyledTableCell>
                                                        </TableRow>
                                                    </>
                                                )
                                            })
                                            : null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                })
            }
        </>
    )
}

export { SelectFamilyMember, CreatePlan }