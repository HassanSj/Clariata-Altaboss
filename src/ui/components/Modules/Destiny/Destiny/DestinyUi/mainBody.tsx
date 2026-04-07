import { Box, Button, Collapse, Divider, Grid, Icon, List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Item from "@progress/kendo-react-charts/dist/npm/components/legend/Item";
import React, { FC, ReactElement, ReactFragment, ReactNode, useEffect, useState } from "react";
import { SelectFamilyMember, CreatePlan } from "./familyDevelopmentPlan/createPlan";
import { DestinyGlobalItem } from "~/types/api/destinyGlobalItem";
import useNotifications from "~/ui/hooks/useNotifications";
import { IFormActionProps } from "~/types/forms";
import { setQuarter } from "date-fns";
import { AdvisorModal } from "./advisorModal/advisorModal";
import api from "~/services/api";
import { useStoreState } from "~/store/hooks";
import moment from "moment";
import { action, useStoreActions } from "easy-peasy";
import { AxiosResponse } from "axios";
import { PlanDetailsTable } from './destinyDevelopmentPlans/showPlanDetails'
import { MS_PER_MINUTE } from "@progress/kendo-date-math";

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



const MainBody = (): ReactElement => {

    const { selectedHousehold, households } = useStoreState((state) => state.household);
    const { persons, selectedPerson } = useStoreState(state => state.person);
    const { destinyGlobalItems, DevelopmentPlans, selectedFamilyPerson, planMemberItems, SelectedPersonItemsAdded } = useStoreState(state => state.destiny);
    const { onPopulate, onSelectPerson, onSetAddedItems, setAddedItems, selectPerson, onAddPlanMemberItem, clear }: any = useStoreActions(actions => actions.destiny)


    const [stateFamily, setFamilyState] = useState({});
    const SettingfamilyPlan = () => {
        persons.map((d, i) => {
            setFamilyState(prevState => ({
                ...prevState,
                [d.PersonID]: true
            }));
        })
    };


    const notification = useNotifications()
    const [createPlan, setCreatePlan] = useState<boolean>(false);
    const [planExists, setPlanExists] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPlanMemberId, setIsPlanMemberId] = useState<boolean>(true);

    //for showing plan details component 
    const [showPlanDetails, setShowPlanDetails] = useState<boolean>(true);

    //selected development plan from the dropdown
    const [selectedDevPlanID, setSelectedDevPlanID] = useState<number>()
    const [selectedYear, setSelectedYear] = useState<number>()

    //current selected DropDownFamily Member id
    const [personId, setPersonId] = useState<any>('')

    //Items added in database
    const [planAddedItems, setPlanAddedItems] = useState<any[]>([])
    const [familyPlanMembers, setFamilyPlanMembers] = useState<any[]>([])

    const [itemId, setItemId] = useState<number>()
    const [developmentPlanId, setDevelopmentPlanId] = useState<number>()
    let [planMemberId, setPlanMemberId] = useState<number>()

    const [createdYearPlan, setCreatedYearPlan] = useState<string | number>(2022)
    const [globalItems, setGlobalItems] = useState<any>();
    const [plans, setPlans] = useState<any>(null);
    const [hideCreatePlan, setHideCreatePlan] = useState<boolean>(false)
    const [hideSelectFamily, setHideSelectFamily] = useState<boolean>(false)
    const classes = useStyles();
    const [showCreateModal, setShowCreateModal] = useState<boolean>()
    const [expanded, setExpanded] = useState<boolean>(false)
    const [currentCategory, setCurrentCategory] = React.useState<number>();
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [title, setTitle] = React.useState<string>('');
    const [category, setCategory] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');

    const resetCallback = () => {

        //empty the list of items once plan is completed
        setShowPlanDetails(true)
        selectPerson(null)
        clear()
        setAddedItems(null)

        //FOR UPDATING THE DROPDOWN ON CLICKING DONE BUTTON
        getDevelopmentPlan()

        SettingfamilyPlan()
        setFamilyPlanMembers([])
        // setFamilyState({})
        setCreatePlan(false)
        setPlanExists(true)
        setIsOpen(false)
        // setPersonId('')
        // setPlanMemberId()
        // setDevelopmentPlanId()
        // setItemId()
        // setCreatedYearPlan(2022)
        // setGlobalItems('')
        // setPlans(null)
        setPlanAddedItems([])
        setHideCreatePlan(false)
        setShowCreateModal(false)
        setHideSelectFamily(false)
        setExpanded(false)
        // setCurrentCategory(undefined)
        // setSearchQuery('')
        // setDescription('')
        // setCategory('')
        // setTitle('')

        notification.addSuccessNotification(`Development Plan  Created Successfull!`)
    }

    const getDevelopmentPlan = async () => {
        try {
            if (DevelopmentPlans?.length) {
                setPlanExists(true)
            }
            await onPopulate(selectedHousehold.HouseholdID)
            setPlans(DevelopmentPlans)

        } catch (error) {
            console.log(error)
        }

    }

    const getGlobalData = async () => {
        setGlobalItems(destinyGlobalItems)
        await onPopulate(selectedHousehold.HouseholdID)
    }

    useEffect(() => {
        console.log('page loaded ..................');
        onPopulate(selectedHousehold.HouseholdID)
        SettingfamilyPlan()
        getDevelopmentPlan()
        getGlobalData()
        console.log('destinyGlobalItems =>', destinyGlobalItems, DevelopmentPlans)
    }, [])

    useEffect(() => {
        console.log('selectedFamilyPerson', selectedFamilyPerson)
        onSetAddedItems({ developmentPlanId, selectedHouseholdID: selectedHousehold.HouseholdID, selectedFamilyPerson })
    }, [selectedFamilyPerson])



    const handleSearch = (newSeacrhQuery: string) => {
        setSearchQuery(newSeacrhQuery)
    }

    const handleExpanded = (i: number) => {
        if (currentCategory != i) {
            setExpanded(true)
            setCurrentCategory(i);
        } else {
            setExpanded(!expanded)
            setCurrentCategory(i);
        }
    };

    const handleCancelCreatePlan = () => {
        setShowCreateModal(false)
        setCreatePlan(false)
        setShowPlanDetails(true)
    }

    const handleCreatePlan = () => {
        setShowCreateModal(true)
        setCreatePlan(true)
        setShowPlanDetails(false)
    }

    const handleCallback = async (Year: string | number) => {
        let aDate = moment(Year, 'YYYY', true);
        let isValid = aDate.isValid();
        // const dPlans: AxiosResponse = await api.developmentPlan.getDevelopmentPlans(selectedHousehold.HouseholdID);
        // setPlans(dPlans)
        getDevelopmentPlan()
        try {
            if (Year > moment().year() || Year == moment().year()) {
                if (isValid) {
                    setCreatedYearPlan(Year)
                    const data = {
                        HouseholdID: selectedHousehold.HouseholdID,
                        Year
                    }
                    let checkPlanExists = true;
                    if (plans != null) {
                        plans.map((d: any, i: number) => d.Year == Year ? checkPlanExists = false : null)
                    }

                    if (checkPlanExists) {
                        await api.developmentPlan.createDevelopmentPlan(data).then((d: any) => {
                            setDevelopmentPlanId(d.data.DevelopmentPlanId)
                            setHideCreatePlan(!hideCreatePlan)
                            getDevelopmentPlan()
                        })
                    } else {
                        notification.addErrorNotification(` Plan ${Year} already Created !`)
                    }
                } else {
                    notification.addErrorNotification(`${Year} is not a valid Year format !`)
                }
            } else {
                notification.addErrorNotification(`${Year} is not a valid Year !`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const SelectFamilyCallback = async (e: any) => {

        //empty the list of added items when family person changes 
        onSetAddedItems(null)

        onSelectPerson(e.currentTarget.value)
        // console.log(e.currentTarget.value)
        // console.log(planMemberItems)
        planMemberItems.find((d: any) => {
            d.PersonID == e.currentTarget.value ? setPlanMemberId((planMemberId = d.PlanMemberID)) : null
        });

        // event.persist()
        // onSetAddedItems({ developmentPlanId, selectedHouseholdID: selectedHousehold.HouseholdID, selectedFamilyPerson })
    }

    const handlePopUp = (Description: string, Category: string, Title: string, ItemId: number) => {
        setItemId(ItemId)
        setDescription(Description)
        setTitle(Title)
        setCategory(Category)
        setIsOpen(true)
    }

    const addItems = async (Description: string, Category: string, Title: string, ItemId: number) => {

        console.log('ItemId', ItemId)
        setItemId(ItemId)
        setDescription(Description)
        setTitle(Title)
        setCategory(Category)
        // console.log(personId)
        if (selectedFamilyPerson != 'None' && selectedFamilyPerson != '') {
            notification.toggleLoading(true)
            await addPlanItems(ItemId)
            await onSetAddedItems({ developmentPlanId, selectedHouseholdID: selectedHousehold.HouseholdID, selectedFamilyPerson })
            notification.toggleLoading(false)
        }
    }

    const addPlanItems = async (ItemId: number) => {

        console.log('developmentPlanId=>', developmentPlanId)
        console.log('selectedFamilyPerson=>', selectedFamilyPerson)

        // if (selectedFamilyPerson != 'None' && selectedFamilyPerson != '' && selectedFamilyPerson != null) {
        let d: any;
        let fam = Object.entries(stateFamily)
        let check = fam.some(([key, val]) => { return key == selectedFamilyPerson ? val : null })
        console.log('check', check)
        if (check == true) {
            console.log('runs')
            d = await api.planmember.addPlanMember({ DevelopmentPlanID: developmentPlanId, HouseholdID: selectedHousehold.HouseholdID, PersonID: selectedFamilyPerson }).then((d: any) => {
                console.log('d.data.planMemberID=>', d.data.PlanMemberID)

                //adding plan members in the store 
                onAddPlanMemberItem({ data: d.data })
                setFamilyPlanMembers(prev => [...prev, d.data])
                // console.log('planMemberItem', planMemberItem);
                console.log('FamilyPlanMembers =>', familyPlanMembers);

                setPlanMemberId((planMemberId = d.data.PlanMemberID))
                if (d.data != null) {
                    if (stateFamily.hasOwnProperty(selectedFamilyPerson)) {
                        fam.map(([key, val]) => {
                            if (key == selectedFamilyPerson) {
                                setFamilyState(prevState => ({
                                    ...prevState,
                                    [key]: false
                                }))
                            }
                        })
                    }
                }
            })
        }

        console.log('stateFamily=>', stateFamily)
        console.log('planMemberId=>', planMemberId)
        const dd: AxiosResponse = await api.planmember.addPlanMemberItem({ DestinyItemID: ItemId, IsAdvisorItem: 0, IsComplete: 0, PlanMemberID: planMemberId, CompletedDate: "2022-05-16T12:42:33.158Z" })
        setPlanAddedItems(prev => [...prev, dd.data])
        console.log(planAddedItems)

        // } else {
        //     notification.addErrorNotification(`Select family first`)
        // }

    }

    const handleClosePopUp = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className="main_wrapper">
                <Box>
                    <Grid container spacing={2}>
                        <Grid item md={3}>
                            <>
                                <div className="sideBar_menu">
                                    <div>
                                        {showCreateModal ? null : <button className="create_plan_button" onClick={handleCreatePlan}>Create Plan</button>}
                                        {planExists && plans ?
                                            <>
                                                <select className=" plansDropdown " name="select" id="d" onChange={(e) => {
                                                    setSelectedDevPlanID(parseInt(e.currentTarget.value))
                                                }}>
                                                    <option value={''}> </option>
                                                    {
                                                        plans.map((d: any, index: number) => {
                                                            return <option key={index} value={d.DevelopmentPlanId}>{d.Year}</option>
                                                        })
                                                    }
                                                </select>
                                            </>
                                            : null}
                                    </div>
                                    <Box >
                                        <Grid container spacing={1} >
                                            <Grid item md={8}>
                                                <input className="search" placeholder="Search" id="filled-size-normal" onChange={(e) => { handleSearch(e.target.value) }} />
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
                                            className={classes.root}
                                        >
                                            {globalItems?.filter((u: any) => u.Category.toLowerCase().includes(searchQuery) || u.Category.includes(searchQuery)).map((data: any, index: number) => {
                                                return (
                                                    <>
                                                        <Divider />
                                                        <ListItem button onClick={() => { handleExpanded(index) }}>
                                                            <ListItemText primary={data.Category} />
                                                            {index == currentCategory && expanded ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Collapse
                                                            in={index == currentCategory && expanded ? true : false}
                                                            timeout="auto"
                                                            unmountOnExit>
                                                            <List component="div" disablePadding>
                                                                <ListItem
                                                                    button
                                                                    className={"list_hover " + classes.nested}
                                                                    key={index}>
                                                                    <ListItemText primary={data.Title} />
                                                                    <Button
                                                                        className="clr_white"
                                                                        onClick={() => { handlePopUp(data.Description, data.Category, data.Title, data.ItemId) }}>
                                                                        Open
                                                                    </Button>
                                                                    {hideCreatePlan ?
                                                                        <Button
                                                                            className="clr_white"
                                                                            onClick={() => {
                                                                                addItems(data.Description, data.Category, data.Title, data.ItemId)
                                                                            }}>
                                                                            Add
                                                                        </Button>
                                                                        : null}
                                                                </ListItem>
                                                            </List>
                                                        </Collapse>
                                                    </>
                                                )
                                            })}
                                        </List>
                                    </div>
                                </div>
                            </>
                        </Grid>
                        <Grid item md={9}>
                            {hideCreatePlan ?
                                null :
                                <>
                                    {createPlan ?
                                        <CreatePlan
                                            cancelCallback={handleCancelCreatePlan}
                                            callback={handleCallback}
                                        />
                                        : plans && planExists ?
                                            null
                                            : "No plans Created"}
                                </>
                            }
                            {hideCreatePlan == true && hideSelectFamily == false ?
                                <SelectFamilyMember
                                    resetCallback={resetCallback}
                                    year={createdYearPlan}
                                    developmentPlanId={developmentPlanId}
                                    SelectFamilycallback={SelectFamilyCallback}
                                />
                                : null}

                            {showPlanDetails && planExists && plans ?
                                <PlanDetailsTable
                                    selectedDevPlanID={selectedDevPlanID}
                                />
                                : null}
                        </Grid>
                    </Grid>
                </Box>
            </div>
            {isOpen ?
                <AdvisorModal
                    callback={handleClosePopUp}
                    isOpen={isOpen}
                    categoryName={category}
                    item={title}
                    itemDescription={description}
                />
                : null}
        </>
    )
}
export default MainBody


