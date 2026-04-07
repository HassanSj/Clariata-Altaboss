import ProfileProps from "~/ui/pages/Profile/components/ProfileProps";
import React, {ReactElement, useEffect} from "react";
import {Button, Chip, Grid} from "@material-ui/core";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {Person} from "~/types/api/person";
import styles from "./ProfileFamilyMembers.module.scss"
import {Family, FamilyPerson, getHouseholdFamily} from "~/services/reports/persons";
import LegacyOfFiveFamilyProfile, {
    formatAddress, formatAgeLabel,
    getPersonAge,
    getPersonName, getWorkItem,
} from "~/ui/components/Reports/LegacyOfFiveFamilyProfile/LegacyOfFiveFamilyProfile";
import * as classnames from "classnames";
import Avatar from "@material-ui/core/Avatar";
import style from "~/ui/pages/Profile/components/ProfileDetailsHeader.module.scss";
import {getPhotoSrc} from "~/ui/constants/user";
import {ContactDataType, ContactDataTypes} from "~/ui/constants/contact";
import {OwnerType, PersonType} from "~/ui/constants/api";
import EditContactModals from "~/ui/components/Contact/EditContactModals";
import useEditable from "~/ui/hooks/useEditable";
import coupledefault from "../../../../../public/images/placeholders/couple_default.png";
import {formatWork} from "~/ui/components/Contact/ContactCard/tabs/WorkTab";
import {NextRouter, useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import { useStoreActions } from "~/store/hooks";
import { getCouplePicture } from "~/ui/components/Reports/StoryOfUsReport/StoryOfUs";

const AccordionSummary = ({title, contacts}:{title:string, contacts?:Person[]}):ReactElement => {
    return (
        <>
            <Grid container className="full-width">
                <span className={styles.AccordionTitle}>{title}</span>
                {contacts &&
                    <Grid container className="full-width m-t-10">
                        {contacts.map(person => (
                            <Chip label={person.FullName} key={person.PersonID} className={styles.BlueChip}/>
                        ))}
                    </Grid>
                }
            </Grid>
        </>
    )
}

/**
 * Row for person occupation
 * @param person
 * @constructor
 */
const OccupationRow = ({person}:{person?: Person}) => {
    const items = getWorkItem(person!)

    return (
        <>
            {items.map(item => (
                <div className={classnames(styles.BcrRows)}>
                    <p>
                        <span>Occupation:</span> {formatWork(item)}
                    </p>
                </div>
            ))}
        </>
    )
}

export const AddressRow = ({person}:{person:FamilyPerson}) => {
    const all = person.person?.AddressList ?? []
    const addresses = all.length > 1 ? all.filter(address => address.MainAddress) : all
    if(person.person?.Deceased)
        return null
    return (
        <>
            {addresses.map(item => (
                <div className={classnames(styles.BcrRows)}>
                    <p><span>Residence:</span> {formatAddress(item)}</p>
                </div>
            ))}
        </>
    )
}

const NameRow = ({person, router}: { person: Person, router: NextRouter }) => {
    const { onSelectContact } = useStoreActions(actions => actions.selected);
    const age = getPersonAge(person)
    return (
        <p>
            <span className={styles.Turquoise}>
                <strong style={{cursor:"pointer"}} onClick={() => {
                    onSelectContact(person.PersonID);
                    router.push(`${paths.CONTACTS}`).then(()=>{
                        window.scrollTo(0,0)
                    })
                }}>{getPersonName(person)}</strong> {age !== '' && <>|</>}
            </span>
            {age !== '' &&
            <> <span>{formatAgeLabel(person)}:</span> {getPersonAge(person)}</>
            }
        </p>
    )
}

/**
 * Presents table for a child of the primary person
 * @param child
 * @param router
 * @param xs
 * @constructor
 */

const ChildrenPersonTable = ({child, router, xs=3, grandParent}:{child: FamilyPerson, xs?: 3|12, router: NextRouter, grandParent?:boolean}):ReactElement => {
    return (
        <div className={xs === 3 ? styles.PersonContainer : 'p-b-10'}>
            <div className={styles.BcrTop}>
                <p>{child?.person?.FirstName}</p>
            </div>
            <div className={classnames(styles.BcrRows)}>
                <NameRow person={child.person!} router={router}/>
            </div>
            {
                grandParent
                ?
                (
                    !child?.person?.Deceased
                    ?
                    <AddressRow person={child}/>
                    :
                    null
                )
                :
                <>
                    <OccupationRow person={child.person}/>
                    <AddressRow person={child}/>
                    {child.spouse && child?.spouse.person &&
                        <>
                            <div className={classnames(styles.BcrRows)}>
                                <NameRow person={child.spouse.person!} router={router}/>
                            </div>
                            <OccupationRow person={child.spouse.person}/>
                            <AddressRow person={child.spouse}/>
                        </>
                    }
                </>
            }
        </div>
    )
}

const PrimaryPersonTable = ({person, router}: {person:FamilyPerson, router: NextRouter}):ReactElement => {
    return (
        <Grid item xs={4} className="p-5">
            <div className={styles.BcrTop}>
                <p>{person?.person?.FirstName} {person?.person?.LastName}</p>
            </div>
            <div className={styles.BcrRows}>
                <NameRow person={person?.person!} router={router}/>
            </div>
            <OccupationRow person={person?.person}/>
            {/*<AddressRow person={person}/>*/}
        </Grid>
    )
}

/**** HELPER FUNCTIONS *****/

export function uniqueFamily(person: FamilyPerson,index:number,self:FamilyPerson[]){
    return self.findIndex(p => p.person?.PersonID === person.person?.PersonID) === index
}

/**
 * Main component
 * @param household
 * @param primaryContacts
 * @param contacts
 * @constructor
 */
const ProfileFamilyMembers = ({household, contacts}:ProfileProps): ReactElement => {
    const [family, setFamily] = React.useState<Family>()
    const router = useRouter()

    useEffect(() => {
        getHouseholdFamily(Number(household?.HouseholdID), true).then((data:Family) => {
            console.log("Data :", data) 
            setFamily(data)
        });
        
    },[])

    const primaryPersonOne = family?.persons?.filter((p) => p?.person?.PersonID === family?.household?.PrimaryPerson1ID)[0];
    const primaryPersonTwo = family?.persons?.filter((p) => p?.person?.PersonID === family?.household?.PrimaryPerson2ID)[0];

    const primaryOneSiblings = primaryPersonOne?.siblings;
    const primaryTwoSiblings = primaryPersonTwo?.siblings;

    const childrenFamily: FamilyPerson[] = family?.persons
        .flatMap(person => person.children ?? [])
        .filter(uniqueFamily) ?? [];

    const parentsFamily: FamilyPerson[] = family?.persons
        .flatMap(person => person.parents ?? [])
        .filter(uniqueFamily) ?? []
    
    const primaryOneGParents = primaryPersonOne?.parents;
    const primaryTwoGparents = primaryPersonTwo?.parents;
    
    const primaryOneParents = primaryPersonOne?.parents;
    const primaryTwoParents = primaryPersonTwo?.parents;

    const editable = useEditable(ContactDataTypes);
    const toggleEditModal = (type: ContactDataType, item?: any) => {
        editable.setSelectedAndShow(type, item);
    }

    return (
        <Grid container className="p-l-50 p-r-50">
            <Grid item xs={12}>
                <div className={styles.ProfileWrapper}>
                <CustomAccordion summary={(<AccordionSummary title="Primary"/>)}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Avatar
                                    className={classnames(style.profileAvatar)}
                                    variant="square"
                                    alt={household?.HouseholdName}
                                    src={getCouplePicture(household)} />
                                <Button color="primary" size="small" onClick={() => toggleEditModal(ContactDataType.COUPLE_PHOTO, household.CouplePhotoObject)}>Edit Photo</Button>
                            </Grid>
                            <Grid container>
                                {
                                    primaryPersonOne ?
                                    <>
                                    <PrimaryPersonTable key={`${primaryPersonOne?.person?.PersonID}-s3`} person={primaryPersonOne} router={router}/>
                                    <Grid item xs={4}></Grid>
                                    </>
                                    :
                                    null
                                }
                                {
                                    primaryPersonTwo ?
                                    <PrimaryPersonTable key={`${primaryPersonTwo?.person?.PersonID}-s3`} person={primaryPersonTwo} router={router}/>
                                    :
                                    null
                                }
                                {/* {family?.persons.sort(s => Number(s.person?.PersonID))?.map(person => { return (
                                    person?.person ? <PrimaryPersonTable key={`${person.person.PersonID}-s3`} person={person!} router={router}/>: null
                                )})} */}
                            </Grid>
                        </Grid>
                    </Grid>
                </CustomAccordion>
                {/* <CustomAccordion summary={(<AccordionSummary title="Siblings"/>)}>
                    <Grid container>
                        {primaryOneSiblings && primaryOneSiblings?.length > 0
                        ?
                        <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}>
                            {primaryOneSiblings?.map(sibling => (
                                sibling && sibling?.person ? (
                                    <div className={styles.PersonContainer}>
                                        <ChildrenPersonTable xs={12} key={`${sibling?.person?.PersonID}-s12`} child={sibling} router={router}/>
                                    </div>
                                ): null
                            ))}
                        </Grid>
                        :null}
                        {primaryTwoSiblings && primaryTwoSiblings?.length > 0
                        ? 
                        <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}>
                            {primaryTwoSiblings?.map(sibling => (
                                sibling && sibling.person ? (
                                    <div className={styles.PersonContainer}>
                                        <ChildrenPersonTable xs={12} key={`${sibling?.person?.PersonID}-s12`} child={sibling} router={router}/>
                                    </div>
                                ): null
                            ))}
                        </Grid>
                        :null}
                    </Grid>
                </CustomAccordion> */}
                <CustomAccordion summary={(<AccordionSummary title="Children"/>)}>
                    {console.log(childrenFamily)}
                    {childrenFamily.map(child => (
                        child.person ? <ChildrenPersonTable key={`${child.person.PersonID}-s2`} child={child} router={router}/> : null
                    ))}
                </CustomAccordion>
                <CustomAccordion summary={(<AccordionSummary title="Grand children"/>)}>
                    <Grid container>
                        {childrenFamily.map(child => (
                            child.person && child?.children && child?.children?.length > 0 ? (
                                // <Grid item xs={3}>
                                <div className={styles.PersonContainer}>
                                    {child.children?.map(grandchild => (
                                        grandchild.person ? <ChildrenPersonTable xs={12} key={`${grandchild.person.PersonID}-s12`} child={grandchild} router={router}/> : null
                                    ))}
                                </div>
                            ): null
                        ))}
                    </Grid>
                </CustomAccordion>
                <CustomAccordion summary={(<AccordionSummary title="Grandparents"/>)}>
                    <Grid container>
                        {primaryOneGParents?.map(parent => (
                            parent.person ? (
                                <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}>
                                    <div className={styles.PersonContainer}>
                                        {parent.parents?.map(grandparent => (
                                            grandparent.person ? <ChildrenPersonTable xs={12} key={`${grandparent.person.PersonID}-s12`} child={grandparent} router={router} grandParent={true}/> : null
                                        ))}
                                    </div>
                                </Grid>
                            ): null
                        ))}
                        {primaryTwoGparents?.map(parent => (
                            parent.person ? (
                                <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}>
                                    <div className={styles.PersonContainer}>
                                        {parent.parents?.map(grandparent => (
                                            grandparent.person ? <ChildrenPersonTable xs={12} key={`${grandparent.person.PersonID}-s12`} child={grandparent} router={router} grandParent={true}/> : null
                                        ))}
                                    </div>
                                </Grid>
                            ): null
                        ))}
                    </Grid>
                </CustomAccordion>
                <CustomAccordion summary={(<AccordionSummary title="Parents"/>)}>
                    <Grid container>
                        {/* {parentsFamily.map(parent => (
                            parent.person ? (
                                // <Grid item xs={3}>
                                <div className={styles.PersonContainer}>
                                    <ChildrenPersonTable xs={12} key={`${parent.person.PersonID}-s12`} child={parent} router={router}/>
                                </div>
                            ): null
                        ))} */}
                        {/* <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}> */}
                            {primaryOneParents?.map(parent => (
                                parent.person ? (
                                    <Grid item xs={3}>
                                    <div className={styles.PersonContainer}>
                                        <ChildrenPersonTable xs={12} key={`${parent.person.PersonID}-s12`} child={parent} router={router}/>
                                    </div>
                                    </Grid>
                                ): null
                            ))}
                        {/* </Grid> */}
                        {/* <Grid item xs={6}></Grid> */}
                        {/* <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}> */}
                            {primaryTwoParents?.map(parent => (
                                parent.person ? (
                                    <Grid item xs={3}>
                                    <div className={styles.PersonContainer}>
                                        <ChildrenPersonTable xs={12} key={`${parent.person.PersonID}-s12`} child={parent} router={router}/>
                                    </div>
                                    </Grid>
                                ): null
                            ))}
                        {/* </Grid> */}
                    </Grid>
                </CustomAccordion>
                <CustomAccordion summary={(<AccordionSummary title="Siblings"/>)}>
                    <Grid container>
                        {primaryOneSiblings && primaryOneSiblings?.length > 0
                        ?
                        <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}>
                            {primaryOneSiblings?.map(sibling => (
                                sibling && sibling?.person ? (
                                    <div className={styles.PersonContainer}>
                                        <ChildrenPersonTable xs={12} key={`${sibling?.person?.PersonID}-s12`} child={sibling} router={router}/>
                                    </div>
                                ): null
                            ))}
                        </Grid>
                        :null}
                        {primaryTwoSiblings && primaryTwoSiblings?.length > 0
                        ? 
                        <Grid item xs={3} style={{display:"flex", flexDirection:"column"}}>
                            {primaryTwoSiblings?.map(sibling => (
                                sibling && sibling.person ? (
                                    <div className={styles.PersonContainer}>
                                        <ChildrenPersonTable xs={12} key={`${sibling?.person?.PersonID}-s12`} child={sibling} router={router}/>
                                    </div>
                                ): null
                            ))}
                        </Grid>
                        :null}
                    </Grid>
                </CustomAccordion>
                {/* <CustomAccordion whiteDetails={true} summary={(<AccordionSummary title="Legacy of Five"/>)}>
                    {family &&
                        <LegacyOfFiveFamilyProfile
                            hideChildren={true}
                            linkNames={true}
                            hideHeader={true}
                            persons={contacts}
                            household={household}
                            showSiblings={true}
                            family={family}/>
                    }
                </CustomAccordion> */}
                </div>
            </Grid>
            <EditContactModals editable={editable} ownerType={OwnerType.HOUSEHOLD}/>
        </Grid>
    )
}

export default ProfileFamilyMembers