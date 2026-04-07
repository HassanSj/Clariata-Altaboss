import React, {Dispatch, ReactElement, SetStateAction, useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Fab, Grid, Icon, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Tab, Tabs, Typography} from "@material-ui/core";
import api from "~/services/api";
import {Person} from "~/types/api/person";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {ApiRequestType, OwnerModelType, OwnerType, PersonType} from "~/ui/constants/api";
import useEditable from "~/ui/hooks/useEditable";
import {ContactDataType, ContactDataTypes} from "~/ui/constants/contact";
import EditContactModals from "~/ui/components/Contact/EditContactModals";
import {Household} from "~/types/api/household";
import useNotifications from "~/ui/hooks/useNotifications";
import {OwnerParams} from "~/types/relations";
import {extractServerError, processServerError} from "~/services/api/errors";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {InterviewDataType} from "~/ui/constants/interview";
import {IObjectiveDataType} from "~/types/objective/store";
import GeneralTab from "~/ui/components/Contact/ContactCard/tabs/GeneralTab";
import WorkTab, { formatWork, formatWorkDates } from "~/ui/components/Contact/ContactCard/tabs/WorkTab";
import EducationTab, { formatEducation } from "~/ui/components/Contact/ContactCard/tabs/EducationTab";
import RelationshipsTab from "~/ui/components/Contact/ContactCard/tabs/RelationshipsTab";
import CommentsTab from "~/ui/components/Contact/ContactCard/tabs/CommentsTab";
import {TabData} from "~/ui/components/Contact/ContactCard/TabProps";
import PersonTitleCard from "~/ui/components/Contact/ContactCard/tabs/helpers/PersonTitleCard";
import initialValues from "~/ui/components/Contact/EditContact/form/initialValues";
import validate from "~/ui/components/Contact/EditContact/form/validate";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {IFormActionProps} from "~/types/forms";
import { MaritalStatus } from '~/types/api/maritalStatus';
import UnsavedPopup from "~/ui/components/Dialogs/UnsavedPopup";
import {
    convertStringToDate,
    convertStringToDateText,
    getDateType,
    hasItems,
    isCustomDateValid,
    StringKeyedObject
} from "~/ui/constants/utils";
import {
    FamilyTitle,
    Gender,
    getPersonTitle,
    IndustryType,
    IndustryTypeLabels,
    MaritalStatuses,
    OtherTitle,
    PersonRelationshipTypeEnum,
    PersonTitle,
    PhoneNumberTypes,
    RoleTypeValues
} from "~/ui/constants/person";
import FormikSubmitFab from "~/ui/components/FormikSubmitFab";
import PersonalTab from "~/ui/components/Contact/ContactCard/tabs/PersonalTab";
import {formatDate} from "@telerik/kendo-intl";
import RoleTab from "~/ui/components/Contact/ContactCard/tabs/RoleTab";
import EnterpriseTab from "~/ui/components/Contact/ContactCard/tabs/EnterpriseTab";
import { getFullName, getMaritalStatus, getPersonType, getPersonTypeEnum, getPhoneNumberType, getPhotoSrc, getPhotoSrcByUrl } from '~/ui/constants/user';
import style from "./ContactCard.module.scss"
import { WorkHistoryItem } from '~/types/api/workHistoryItem';
import EmptyContainer from '../../Containers/EmptyContainer';
import { Role } from '~/types/api/role';
import { Company } from '~/types/api/company';
import { AnyRecordWithTtl } from 'dns';
import { DevelopmentPlanCategoryItem, getDevelopmentPlanData } from '../../Reports/DevelopmentPlanReport/DevelopmentPlan';
import CommentList from '../CommentList';
import { formatPhoneNumber } from './tabs/accordions/ContactAccordion';
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import useSWR, { mutate } from 'swr';
import { EducationItem } from '~/types/api/educationItem';
import { AddressItem } from '~/types/api/addressItem';
import { PersonalRelationship } from '~/types/api/personalRelationship';
import { PhoneNumberItem } from '~/types/api/phoneNumberItem';
import usePersons from '~/ui/hooks/usePersons';
import useHousehold from '~/ui/hooks/useHousehold';
import { PhoneNumberType } from '~/types/api/phoneNumberType';
import { useRouter } from 'next/router';
import paths from '~/ui/constants/paths';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
interface IProps {
    ownerType?: OwnerType;
    person?: Person,
    household?: number,
    hideAvatar?: boolean;
    isModal?: boolean;
    isEditing?: boolean;
    closeEdit: any;
    showEdit: any;
    afterSave?: () => void;
    newPerson?: boolean;
    isNewPerson?: boolean;
    setIsNewPerson? : Dispatch<SetStateAction<boolean>>;
    markIsDirty: any;
    exit: any;
}

const datePresent = (date: string | undefined): boolean => {
    return !!(date && !date.includes("NaN"))
}

function setDateFields(populatedValues: Person, setErrors: any): any {
    const errors: StringKeyedObject = {}

    if (datePresent(populatedValues.DateOfBirth)) {
        if(isCustomDateValid(populatedValues.DateOfBirth!)) {
            populatedValues.DateOfBirthString = String(getDateType(populatedValues.DateOfBirth))
            populatedValues.DateOfBirth = formatDate(convertStringToDate(populatedValues.DateOfBirth!, Number(populatedValues.DateOfBirthString)), "yyyy-MM-dd")
        }else{
            errors.DateOfBirth = "Date of birth is invalid"
        }
    } else {
        populatedValues.DateOfBirth = undefined
    }

    if (datePresent(populatedValues.DateOfDeath)) {
        if(isCustomDateValid(populatedValues.DateOfDeath!)) {
            populatedValues.DateOfDeathString = String(getDateType(populatedValues.DateOfDeath))
            populatedValues.DateOfDeath = formatDate(convertStringToDate(populatedValues.DateOfDeath!, Number(populatedValues.DateOfDeathString)), "yyyy-MM-dd")
        }else{
            errors.DateOfDeath = "Date of death is invalid"
        }
    } else {
        populatedValues.DateOfDeath = undefined
    }

    if (datePresent(populatedValues.MarriageDate)) {
        if(isCustomDateValid(populatedValues.MarriageDate!)) {
            populatedValues.MarriageDateString = String(getDateType(populatedValues.MarriageDate))
            populatedValues.MarriageDate = formatDate(convertStringToDate(populatedValues.MarriageDate!, Number(populatedValues.MarriageDateString)), "yyyy-MM-dd")
        }else{
            errors.MarriageDate = "Marriage date is invalid"
        }
    } else {
        populatedValues.MarriageDate = undefined
    }

    if (datePresent(populatedValues.DivorcedDate)) {
        if(isCustomDateValid(populatedValues.DivorcedDate!)) {
            populatedValues.DivorcedDateString = String(getDateType(populatedValues.DivorcedDate))
            populatedValues.DivorcedDate = formatDate(convertStringToDate(populatedValues.DivorcedDate!, Number(populatedValues.DivorcedDateString)), "yyyy-MM-dd")
        }else{
            errors.DivorcedDate = "Divorced date is invalid"
        }
    } else {
        populatedValues.DivorcedDate = undefined
    }

    if (datePresent(populatedValues.SeparatedDate)) {
        if(isCustomDateValid(populatedValues.SeparatedDate!)) {
            populatedValues.SeparatedDateString = String(getDateType(populatedValues.SeparatedDate))
            populatedValues.SeparatedDate = formatDate(convertStringToDate(populatedValues.SeparatedDate!, Number(populatedValues.SeparatedDateString)), "yyyy-MM-dd")
        }else{
            errors.SeparatedDate = "Separated date is invalid"
        }
    } else {
        populatedValues.SeparatedDate = undefined
    }

    if (datePresent(populatedValues.WidowedDate)) {
        if(isCustomDateValid(populatedValues.WidowedDate!)) {
            populatedValues.WidowedDateString = String(getDateType(populatedValues.WidowedDate))
            populatedValues.WidowedDate = formatDate(convertStringToDate(populatedValues.WidowedDate!, Number(populatedValues.WidowedDateString)), "yyyy-MM-dd")
        }else{
            errors.WidowedDate = "Window date is invalid"
        }
    } else {
        populatedValues.WidowedDate = undefined
    }

    if(Object.keys(errors).length){
        setErrors(errors)
        return errors
    }else{
        return true
    }
}

const ContactCard = ({ownerType = OwnerType.PERSON, person, household, afterSave, hideAvatar = false, isEditing, closeEdit, showEdit, newPerson, isNewPerson , setIsNewPerson, markIsDirty, exit}: IProps): ReactElement => {
    const notifications = useNotifications();
    const { contactId, householdId } = useStoreState(state => state.selected);
    const { onSelectContact } = useStoreActions(actions => actions.selected);
    const { onSetSaved } = useStoreActions(actions => actions.contact);
    const { unsaved } = useStoreState(state => state.contact);
    
    const router = useRouter()
    // const {addresses, phoneNumbers} = useStoreState(state => state.contact);

    // const urlPersons = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`;
    // const { data: persons} = useSWR<Person[]>([urlPersons, getAccessToken()], fetcher);

    const { persons } = usePersons();
    const { household: selectedHousehold } = useHousehold();

    //const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`;
    //const {data: selectedHousehold} = useSWR<Household>([urlHousehold, getAccessToken()], fetcher);
  
    const urlPhoneNumbers = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/phonenumber/list`;
    const {data: selectedPhoneNumbers} = useSWR<PhoneNumberItem[]>([urlPhoneNumbers, getAccessToken()], fetcher, {refreshInterval: 300});

    const urlRelationships = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/personalrelationship/list`;
    const {data: selectedRelationships} = useSWR<PersonalRelationship[]>([urlRelationships, getAccessToken()], fetcher);

    const urlWork = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/workhistory/list`;
    const {data: selectedWorkHistory} = useSWR<WorkHistoryItem[]>([urlWork, getAccessToken()], fetcher);

    const urlEducation = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/education/list`;
    const {data: selectedEducation} = useSWR<EducationItem[]>([urlEducation, getAccessToken()], fetcher);

    const urlAddresses = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/address/list`;
    const {data: selectedAddresses} = useSWR<AddressItem[]>([urlAddresses, getAccessToken()], fetcher);   
    const { data: phoneNumberTypes } = useSWR<PhoneNumberType[]>([`${process.env.NEXT_PUBLIC_API_URL}/phonenumbertype/list`, getAccessToken()], fetcher);

    //const { persons } = useStoreState(state => state.person);
    const {onPopulate, onClear, onSelect} = useStoreActions(actions => actions.person);
    //const householdActions = useStoreActions(actions => actions.household)
    const {user} = useStoreState(state => state.user);
    //const {selectedHousehold} = useStoreState(state => state.household);
    //const {selectedPhoneNumbers} = useStoreState(store => store.person)
    //const { selectedRelationships } = useStoreState(state => state.person);
    //const { maritalStatuses } = useStoreState(state => state.constants);
    const { data: maritalStatuses } = useSWR<MaritalStatus[]>([`${process.env.NEXT_PUBLIC_API_URL}/maritalstatus/list`, getAccessToken()], fetcher);
    //const { selectedWorkHistory } = useStoreState(state => state.person);
    //const { selectedEducation } = useStoreState(state => state.person);
    //const { selectedPerson } = useStoreState(state => state.person);
    //const { selectedAddresses } = useStoreState(store => store.person)

    // const householdactions = useStoreActions(actions => actions.household);
    // const objectiveActions = useStoreActions(actions => actions.objective);
    // const interviewActions = useStoreActions(actions => actions.interview);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [tabsKey, setTabsKey] = useState<number>(0);
    const [developmentplan, setDevelopmentPlan] = useState<DevelopmentPlanCategoryItem[]>()

    const isEdit = !person?.PersonID

    const alterPersonDates = (p: Person) => {
        const copy: Person = JSON.parse(JSON.stringify(p))

        if (copy.DateOfBirth)
            copy.DateOfBirth = convertStringToDateText(copy.DateOfBirth!, Number(p.BirthDateType))!
        if (copy.MarriageDate)
            copy.MarriageDate = convertStringToDateText(copy.MarriageDate!, Number(p.MarriageDateString))!
        if (copy.DateOfDeath)
            copy.DateOfDeath = convertStringToDateText(copy.DateOfDeath!, Number(p.DeathDateType))!
        if (copy.DivorcedDate)
            copy.DivorcedDate = convertStringToDateText(copy.DivorcedDate!, Number(p.DateOfDeathString))!
        if (copy.SeparatedDate)
            copy.SeparatedDate = convertStringToDateText(copy.SeparatedDate!, Number(p.SeparatedDateString))!
        if (copy.WidowedDate)
            copy.WidowedDate = convertStringToDateText(copy.WidowedDate!, Number(p.WidowedDateString))!

        copy.GenderID = copy.GenderID ?? Gender.UNKNOWN
        if (p.PersonTypeID === PersonType.PRIMARY)
            copy.PersonTitleID = FamilyTitle.PRIMARY


        return copy
    }

    // @ts-ignore
    const [currentValues, setCurrentValues] = useState<Person | undefined>(person ? alterPersonDates(person) : initialValues);
    const onValuesChange = (changes: Person) => {
        if (JSON.stringify(changes) !== JSON.stringify(currentValues))
        {
            console.log("Is Dirty");
            markIsDirty(true);
            setCurrentValues(changes);
        }
    }

    const ownerParams: OwnerParams = {
        requestType: ApiRequestType.LIST,
        modelName: 'person',
        ownerType: OwnerType.PERSON,
        personId: contactId,
        householdId: householdId,
        commentSetId: person?.CommentSetID
    };

    // Delete the person
    const remove = async () => {
        if (!person?.PersonID) return;
        notifications.toggleLoading(true);
        try {
            ownerParams.requestType = ApiRequestType.REMOVE;
            api.person.remove(ownerParams, person);
            // clear selected
            await onClear(null);
            //await householdactions.onPopulate({});
            //await interviewActions.onPopulate({type: InterviewDataType.ALL});
            //await objectiveActions.onPopulate({type: IObjectiveDataType.ALL});
            //householdactions.updateSelectedHousehold();

            // await householdactions.onSelect(selectedHousehold as Household);
            // Re populate
            //await onPopulate({}); // TODO - optimize this
        } catch (err) {
            processServerError(err, 'ContactCard.remove');
        }
        notifications.toggleLoading(false);
    }

    // Use editable
    const editable = useEditable(ContactDataTypes);
    const toggleEditModal = (type: ContactDataType, item: any | undefined) => {
        editable.setSelectedAndShow(type, item);
    }
    

    const endEditMode = async () => {
        //mutate(urlPersons);   
        closeEdit();
        await onSetSaved({saved : false})
        // isEditing = false;
    }

    // Create or update

    const params: OwnerParams = {
        ownerType: OwnerType.HOUSEHOLD,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: person?.PersonID,
        modelName: OwnerModelType.PERSON,
        userId: user?.UserID,
        personId: contactId,
        householdId: householdId,
    };

    const updateSpouse = async (values: Person) => {
        const spouseID = selectedRelationships?.find(rel => rel.PersonalRelationshipTypeID === PersonRelationshipTypeEnum.SPOUSE)

        if(spouseID){
            const spouse = persons?.find(p => p.PersonID === spouseID.AssociatePersonID)
            if(spouse){
                spouse.MaritalStatusID = values.MaritalStatusID
                spouse.MarriageDate = values.MarriageDate
                spouse.MarriageDateString = values.MarriageDateString

                const pms: OwnerParams = {
                    ownerType: OwnerType.HOUSEHOLD,
                    requestType: ApiRequestType.UPDATE,
                    modelId: spouse?.PersonID,
                    modelName: OwnerModelType.PERSON,
                    userId: user?.UserID,
                    personId: spouse?.PersonID,
                    householdId: householdId,
                };
                await api.person.update(pms, spouse);
            }
        }
    }

    /**
     * Create or update a contact
     * @param values
     * @param setErrors
     */
    const createOrUpdate = async (values: Person, {setErrors}: IFormActionProps) => {
        notifications.toggleLoading(true);
        const populatedValues = {
            ...values,
            PersonTypeID: values?.PersonTypeID,
            BirthDateType: values?.DateOfBirth ? getDateType(values.DateOfBirth): undefined,
            DeathDateType: values?.DateOfBirthString ? getDateType(values.DateOfDeath): undefined,
        }

        const datesValid = setDateFields(populatedValues, setErrors)

        if(datesValid !== true){
            notifications.toggleLoading(false)
            throw Error(datesValid[Object.keys(datesValid)[0]]);
        }else {

            await updateSpouse(populatedValues)
            params.requestType = ApiRequestType.CREATE_UPDATE;
            const res = await api.person.createOrUpdate(params, populatedValues);
            setErrors({successMessage: 'Contact successfully created!'});
            onSelectContact(res?.data?.PersonID)
            const resUpdated = await api.person.getFull(res?.data?.PersonID, householdId);
            // if(newPerson){
            //     const params: OwnerParams = {
            //         ownerType,
            //         requestType: ApiRequestType.CREATE_UPDATE,
            //         modelId: 0,
            //         modelName: OwnerModelType.PHONENUMBER,
            //         userId: user?.UserID,
            //         personId: res?.data?.PersonID,
            //         householdId: householdId
            //     };
            //     phoneNumbers?.forEach(async (number) => {
            //         const res = await api.phonenumber.remove(params, number);
            //     })
            // }
            //mutate(urlPersons);
            //await onPopulate({});
            //await onSelect({person: resUpdated})

            // if (populatedValues.PersonTypeID === PersonType.PRIMARY) {
            //     await householdActions.onPopulate({})
            // }
        }

        person = populatedValues;

        // @ts-ignore
        if (window.buildDiagram) {
            // @ts-ignore
            await window.buildDiagram()
        }

        closeEdit();
        downloadRoles();
        downloadCompanies();
        loadDevelopmentPlan();

        if (afterSave) {
            afterSave();
            setSelectedTab(0)
        }
        notifications.toggleLoading(false);
    };

    /**
     * Tab details
     */
    const TABS: TabData[] = [
        {
            label: "General",
            key: `general-${person?.Photo?.PhotoID ?? 1}`,
            component: GeneralTab,
            props: {
                setShowDeleteConfirmation,
                hideAvatar
            }
        },
        {
            label: "Personal",
            key: "personal",
            component: PersonalTab,
            forType: [PersonType.FAMILY, PersonType.PRIMARY]
        },
        {
            label: "Work History",
            key: "work",
            component: WorkTab,
            forType: [PersonType.FAMILY, PersonType.PRIMARY],
            customCondition: (p) => {
                return p ? p.PersonTypeID === PersonType.OTHER && p.PersonTitleID === OtherTitle.ENTERPRISE : false;
            }
        },
        {
            label: "Education",
            key: "education",
            component: EducationTab,
            forType: [PersonType.FAMILY, PersonType.PRIMARY]
        },
        {
            label: "Relationships",
            key: "relationships",
            component: RelationshipsTab,
            forType: [PersonType.FAMILY, PersonType.PRIMARY,PersonType.PROFESSIONAL,PersonType.OTHER]
        },
        {
            label: "Role",
            key: "role",
            component: RoleTab,
            forType: [PersonType.PRIMARY,PersonType.FAMILY,PersonType.PROFESSIONAL,PersonType.OTHER]
        },
        {
            label: "Enterprise",
            key: "enterprise",
            component: EnterpriseTab,
            forType: [PersonType.PRIMARY,PersonType.FAMILY,PersonType.OTHER]
        },
        {
            label: "Comments",
            key: "comments",
            component: CommentsTab,
            props: {
                ownerType
            }
        }
    ]

    const [selectedTab, setSelectedTab] = React.useState<number>(0)
    const [roles, setRoles] = useState<Role[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const tabsToPreset = TABS.filter(tab => isEdit || tab.forType === undefined || (tab.forType ?? []).includes(person?.PersonTypeID ?? PersonType.ALL) || (tab.customCondition && tab.customCondition(person!)))
    const newPersonTabs = TABS.filter(tab => tab.label === "General" || tab.label === "Personal")

    const downloadRoles = async () => {
        if(person?.PersonID) {
            const rolesData = await api.role.list(householdId, contactId)
            if(rolesData) {
                setRoles(rolesData.data)
            }
        }
    }

    const goToWorksheet = () => {
        router.push({
            pathname: paths.PROFILE_WORKSHEET,
            query: {id: contactId}
        })
    }

    const downloadCompanies = async () => {
        if(person?.PersonID) {
            const companiesData = await api.company.list(householdId, contactId)
            if(companiesData) {
                setCompanies(companiesData.data)
            }
        }
    }

    const loadDevelopmentPlan = async  () => {

        const res = await api.developmentPlan.getDevelopmentPlans(householdId as number);
        const planId = res.data.length > 0 ? res.data[0].DevelopmentPlanId : 0;
        const downloadDevelopmentPlan = await getDevelopmentPlanData(contactId as number, planId as number, householdId as number);
        setDevelopmentPlan(downloadDevelopmentPlan);        
    }

    const reload = () => {
        downloadRoles();
        downloadCompanies();
        loadDevelopmentPlan();
        mutate([urlPhoneNumbers])
        mutate(urlAddresses);
    }

    const setUnsaved = async () => {
        if(isEditing){
            await onSetSaved({saved : true})
        }
    }

    useEffect(() => {
        downloadRoles();
        downloadCompanies();
        loadDevelopmentPlan();
        setUnsaved();
    },[person])

    return (
        isEditing ? 
        <>
            <Card>
                <Tabs
                    indicatorColor="secondary"
                    textColor="secondary"
                    scrollButtons="auto"
                    variant="scrollable"
                    value={selectedTab}
                    onChange={(e, value) => setSelectedTab(value)}>
                    {
                        (newPerson != undefined && newPerson) 
                        ?
                            newPersonTabs.map((tab, index) => (
                                <Tab
                                    key={tab.key}
                                    label={tab.label}
                                    selected={index === selectedTab}/>
                            ))
                        :
                            tabsToPreset.map((tab, index) => (
                                <Tab
                                    key={tab.key}
                                    label={tab.label}
                                    selected={index === selectedTab}/>
                            ))
                    }
                </Tabs>
            </Card>
            <Grid className="m-t-10 p-20" container key={tabsKey}>
                <Grid item xs={12}>
                    <FormWrapper initialValues={currentValues}
                                 validationSchema={validate}
                                 onSubmit={createOrUpdate}
                                 onValuesChange={onValuesChange}
                                 modelName="Contact">
                        {
                            !isNewPerson

                            ?

                            <PersonTitleCard phoneNumbers={selectedPhoneNumbers ?? []}
                            person={person!}
                            currentValues={currentValues}
                            setShowDeleteConfirmation={setShowDeleteConfirmation}
                            toggleEditModal={toggleEditModal}
                            endEditMode={endEditMode}/>
                            
                            :

                            null
                        }
                        <Grid container className="m-t-20">
                            <Grid item xs={12}>
                                {
                                    tabsToPreset.map((tabData, index) => tabData.component ? (
                                        <div style={index !== selectedTab ? {display: "none"} : {}} key={tabData.key}>
                                            {React.createElement(
                                                tabData.component,
                                                {
                                                    ...(tabData.props ?? {}),
                                                    toggleEditModal,
                                                    isEdit,
                                                    person: currentValues,
                                                    personEntity: person,
                                                    reload
                                                }
                                            )}
                                        </div>
                                    ) : "No tab data")
                                }
                            </Grid>
                        </Grid>
                        {isEditing ?
                        <Fab
                            onClick={()=> exit()}      
                            aria-label="cancel"
                            color="primary"
                            variant="extended"
                            className={style.floatingButton2}
                            >
                            EXIT
                        </Fab>
                        : <></> 
                        }
                        <FormikSubmitFab show={isEditing} changePersonStatus={setIsNewPerson} markIsNotDirty={() => markIsDirty(false)}/>
                        
                    </FormWrapper>
                </Grid>
            </Grid>
            <EditContactModals editable={editable} ownerType={ownerType} onHide={() => setTabsKey(tabsKey+1) } refresh={reload} isNewPerson={isNewPerson} markIsDirty={() => markIsDirty(true)}/>
            <ConfirmationModal isOpen={showDeleteConfirmation}
                               onConfirm={remove}
                               onCancel={() => setShowDeleteConfirmation(false)}/>
        </>
        :
        <>
            <Card className="mb-20">
                <Grid container className="m-t-10 p-20">
                    <Grid item xs={8}></Grid>
                    <Grid item xs={2}>
                        {
                            person?.PersonTypeID === PersonType.FAMILY || PersonType.PRIMARY 
                            ?
                                <div style={{textAlign: "right"}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { 
                                            goToWorksheet()
                                        }}
                                    >
                                        Profile Worksheet
                                    </Button>
                                </div>
                            :
                            null
                        }
                    </Grid>
                    <Grid item xs={2}>
                        <div style={{textAlign: "right"}}><Button variant="contained" color="primary"  onClick={() => { 
                            showEdit(); 
                            setSelectedTab(0)
                            }
                        }>Edit Details</Button></div>
                    </Grid>
                    <Grid item xs={2}>
                        <img src={getPhotoSrcByUrl(person?.PhotoURL)} style={{maxHeight: "150px"}} />
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={1}>
                            <Grid xs={12}>
                                <div style={{fontSize: "20px", fontWeight: "bold"}}>
                                    {person?.PreferredName ? person.PreferredName : person?.FirstName} {person?.LastName}
                                </div>
                                <div>{getPersonTitle(person)}</div>
                            </Grid>
                            <Grid item xs={6}>                                
                                <div><a href={`mailto:${person?.EmailAddress}`}>{person?.EmailAddress}</a></div>
                                <div><h3 className="storyofus-row-h3">PHONE NUMBERS</h3></div>
                                {!isEditing && selectedPhoneNumbers?.map((phone) => {
                                    return (
                                        <>
                                            <div>
                                            {<span>{getPhoneNumberType(Number(phone.PhoneNumberTypeID), (PhoneNumberTypes))} - </span>} {formatPhoneNumber(phone.PhoneNumber ?? "") ?? ""}
                                            </div>
                                        </>
                                    )}
                                )}
                                <div><h3 className="storyofus-row-h3">ADDRESSES</h3></div>
                                {!isEditing && selectedAddresses?.map((address) => {
                                    return (
                                        <>
                                            <div>
                                            {<span>{address?.AddressDescription} - </span>} {address.StreetAddress} {address.City} {address.StateRegion} {address.PostalCode}
                                            </div>
                                        </>
                                    )}
                                )}
                            </Grid>
                            <Grid>
                            <div><h3 className="storyofus-row-h3">SOCIAL MEDIA</h3></div>  
                                <div className='social-media'>                          
                                <div>
                                { person?.LinkedIn ? 
                                <>
                                <ListItem style={{padding:"unset"}}>
                                    <ListItemIcon>
                                        <a href={person?.LinkedIn} target="_blank" >
                                        <LinkedInIcon />
                                        </a>
                                    </ListItemIcon>
                                </ListItem>
                                </>
                                :
                                "" }
                                </div>
                                <div>
                                { person?.Facebook ? 
                                <>
                                <ListItem style={{padding:"unset"}}>
                                    <ListItemIcon>
                                    <a href={person?.Facebook} target="_blank" >
                                        <FacebookIcon />
                                        </a>
                                    </ListItemIcon>
                                </ListItem>
                                </>
                                :
                                "" }
                                </div>
                                <div>
                                { person?.Twitter ? 
                                <>
                                <ListItem style={{padding:"unset"}}>
                                    <ListItemIcon>
                                    <a href={person?.Twitter} target="_blank" >
                                        <TwitterIcon />
                                        </a>
                                    </ListItemIcon>
                                </ListItem>
                                </>
                                :
                                "" }
                                </div>
                                <div>
                                { person?.Instagram ? 
                                <>
                                <ListItem style={{padding:"unset"}}>
                                    <ListItemIcon>
                                    <a href={person?.Instagram} target="_blank" >
                                        <InstagramIcon />
                                        </a>
                                    </ListItemIcon>
                                </ListItem>
                                </>
                                :
                                "" }
                                </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>                    
            </Card>
            {person?.PersonTypeID ? person?.PersonTypeID < 4 ?
            <Accordion expanded={true}>
                <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header" style={{backgroundColor: "#f0f9f7", padding:"0px 16px !important", minHeight: "20px !important", fontSize: "14px", fontWeight: "bold"}}
                >
                    Personal
                </AccordionSummary>
                <AccordionDetails>
                <Grid container className="m-t-10 p-20" spacing={2}>
                    <Grid item xs={12} lg={12}>
                        <Grid container spacing={2}>
                                <Grid item xs={4} lg={4}>
                                    <h3 className="storyofus-row-h3">BIRTHDATE</h3>
                                    <div>{convertStringToDateText(person!.DateOfBirth!, Number(person!.DateOfBirthString))!}</div>
                                </Grid>
                                <Grid item xs={4} lg={4}>
                                    <h3 className="storyofus-row-h3">BIRTHPLACE</h3>
                                    <div>{person?.Birthplace}</div>
                                </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <Grid container spacing={2}>
                            {person?.Deceased
                            ?

                                <Grid item xs={4} lg={4}>
                                    <h3 className="storyofus-row-h3">DECEASED</h3>
                                    <div>{person?.Deceased === true ? "Yes" : "No"}</div>
                                </Grid>
                            :
                            null}
                        </Grid>
                        <Grid container spacing={2}>
                                {person?.Deceased ?
                                <>
                                <Grid item xs={4} lg={4}>
                                    <h3 className="storyofus-row-h3">DATE OF DEATH</h3>
                                    <div>{convertStringToDateText(person!.DateOfDeath!, Number(person!.DateOfDeathString))!}</div>
                                </Grid>
                                <Grid item xs={4} lg={4}>
                                    <h3 className="storyofus-row-h3">Location</h3>
                                    <div>{person.DeathLocation}</div>
                                </Grid>
                                <Grid item xs={4} lg={4}>
                                    <h3 className="storyofus-row-h3">Cause</h3>
                                    <div>{person.DeathCause}</div>
                                </Grid>
                                </>
                                : null }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} lg={4}>
                                <h3 className="storyofus-row-h3">MARITAL STATUS</h3>
                                <div>{getMaritalStatus(person?.MaritalStatusID, maritalStatuses as MaritalStatus[])}</div>
                            </Grid>
                            <Grid item xs={4} lg={4}>
                                <h3 className="storyofus-row-h3">MARRIAGE DATE</h3>
                                <div>{convertStringToDateText(person!.MarriageDate!, Number(person!.MarriageDateString))!}</div>
                            </Grid> 
                            <Grid item xs={4} lg={4}>
                                <h3 className="storyofus-row-h3">RELIGIOUS AFFILIATION</h3>
                                <div>{person?.ReligiousAffiliation}</div>
                            </Grid> 
                            <Grid item xs={4} lg={4}>
                                <h3 className="storyofus-row-h3">ACTIVITIES/HOBBIES</h3>
                                <div>{person?.Hobbies}</div>
                            </Grid>                        
                            <Grid item xs={4} lg={4}>
                                <h3 className="storyofus-row-h3">EDUCATION/DEGREE</h3>
                                <List dense={true}>
                                            {hasItems(selectedEducation) ? selectedEducation?.sort((item1:any, item2:any) => {
                                                const date1 = new Date(item1.CompletionDate)
                                                const date2 = new Date(item2.CompletionDate)

                                                return date1 < date2 ? -1 : 1
                                            }).map((item: any, index: number) => {
                                                return (
                                                    <ListItem button={false} key={index}>
                                                        <ListItemText>
                                                            {formatEducation(item)} - 
                                                            <span> {convertStringToDateText(item?.CompletionDate,Number(item.CompletionDateString))}</span>
                                                        </ListItemText>
                                                    </ListItem>
                                                )
                                            }) : <></> }
                                </List>
                            </Grid>                            
                            <Grid item xs={12} lg={4}>
                                <h3 className="storyofus-row-h3">Work History</h3>
                                <List dense={true}>
                                    {hasItems(selectedWorkHistory) ? selectedWorkHistory?.map((item: WorkHistoryItem, index: number) =>
                                    <ListItem button={false} key={index} >
                                    <ListItemText>
                                    {formatWork(item)}
                                    <span> - {formatWorkDates(item)}</span><br />
                                    <Typography variant="caption" gutterBottom>
                                        {item?.Description}
                                    </Typography>
                                    </ListItemText>
                                            </ListItem>
                                    ) : <></> }
                                </List>
                            </Grid>
                            {/* <Grid item xs={4} lg={4}>
                                <h3 className="storyofus-row-h3">ROLES</h3>
                                <List dense={true}>
                                    {hasItems(roles) ? roles?.map((item: Role, index: number) =>
                                        <ListItem button key={index} onClick={() => toggleEditModal(ContactDataType.ROLE, item)}>
                                            <ListItemText>
                                                {RoleTypeValues[item.Role]}
                                                <span> - {item.ForPerson}</span><br />
                                                <span>{item.AdditionalInformation}</span>
                                            </ListItemText>
                                        </ListItem>
                                    ) : <></> }
                                </List>
                            </Grid> */}
                    
                    
                    </Grid>
                    </Grid>
                </Grid>
                </AccordionDetails>
            </Accordion>
            : null : null }
            <Accordion>
                <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header" style={{backgroundColor: "#f0f9f7", padding:"0px 16px !important", minHeight: "20px !important", fontSize: "14px", fontWeight: "bold"}}
                >
                    Roles
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={6}>
                            <h3 className="storyofus-row-h3">Roles</h3>
                            <List dense={true}>
                                {hasItems(roles) ? roles?.map((item: Role, index: number) =>
                                    <ListItem button key={index} >
                                        <ListItemText>
                                            {RoleTypeValues[item.Role]} for {item.ForPerson} {item.AdditionalInformation ? "- " + item.AdditionalInformation : null}
                                        </ListItemText>
                                    </ListItem>
                                ) : <></> }
                            </List>
                        </Grid>`
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header" style={{backgroundColor: "#f0f9f7", padding:"0px 16px !important", minHeight: "20px !important", fontSize: "14px", fontWeight: "bold"}}
                >
                    Relationships
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={6}>
                            <List dense={true}>
                                {hasItems(selectedRelationships) ? selectedRelationships?.map((item: PersonalRelationship, index: number) => {
                                    let person = persons?.find(p => p.PersonID == item.AssociatePersonID)
                                    return (
                                        <ListItem button key={index}>
                                            <ListItemAvatar>
                                                <Avatar variant="square" src={getPhotoSrcByUrl(person?.PhotoURL)} />
                                            </ListItemAvatar>
                                            <ListItemText>
                                                {getFullName(person)} <br />
                                                <span>{getPersonTitle(person)}</span>
                                            </ListItemText>
                                        </ListItem>
                                    )
                                }) : <></> }
                            </List>
                        </Grid>`
                    </Grid>
                </AccordionDetails>
            </Accordion>
            {person?.PersonTypeID ? person?.PersonTypeID < 4 ?
            <Accordion>
                <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header" style={{backgroundColor: "#f0f9f7", padding:"0px 16px !important", minHeight: "20px !important", fontSize: "14px", fontWeight: "bold"}}
                >
                    Enterprises
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={6}>
                            <h3 className="storyofus-row-h3">ENTERPRISE</h3>
                            <List dense={true}>
                                {hasItems(companies) ? companies?.map((item: Company, index: number) =>
                                    <ListItem button key={index} >
                                        <ListItemText>
                                            {item.Name} - 
                                            {item.IndustryType !== undefined &&
                                                <><span> {IndustryTypeLabels[item.IndustryType]}</span></>
                                            }
                                        </ListItemText>
                                    </ListItem>
                                ) : <></> }
                            </List>
                        </Grid>`
                    </Grid>
                </AccordionDetails>
            </Accordion>
            : null : null }
            {person?.PersonTypeID ? person?.PersonTypeID < 4 ?
            <Accordion>
                <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header" style={{backgroundColor: "#f0f9f7", padding:"0px 16px !important", minHeight: "20px !important", fontSize: "14px", fontWeight: "bold"}}
                >
                    Development Plan
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={12}>
                        { developmentplan?.map((category) => {
                                return (
                                    <div>
                                        <div className="developmentplan-header">
                                            { category.category}
                                        </div>
                                        <div className="developmentplan-row">
                                            { category.items.map((itemType) => {
                                                return (
                                                    <div>
                                                        <div className="developmentplan-row-h3">{itemType.itemType}</div>
                                                        { itemType.items.map((item) => {
                                                            return(
                                                                <>
                                                                    <div style={{marginBottom: "20px"}}>
                                                                        <div style={{display: "flex"}}>
                                                                            <div style={{flex: "1"}}>{item.Subcategory}</div>
                                                                            <div style={{flex: "2"}}>{item.Title}</div>
                                                                        </div>
                                                                        <div style={{display: "flex"}}>
                                                                            <div style={{flex: "1"}}>{item.StartDate}</div>
                                                                            <div style={{flex: "2"}}>{item.Author}</div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </Grid>`
                    </Grid>
                </AccordionDetails>
            </Accordion>
            : null : null }
            <Accordion>
                <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header" style={{backgroundColor: "#f0f9f7", padding:"0px 16px !important", minHeight: "20px !important", fontSize: "14px", fontWeight: "bold"}}
                >
                    Comments
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item xs={6}>
                        <CommentList ownerType={ownerType} ownerId={person?.PersonID} />
                        </Grid>`
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default ContactCard;

