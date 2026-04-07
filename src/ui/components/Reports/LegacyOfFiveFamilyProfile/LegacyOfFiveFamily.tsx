import React, {ReactElement} from "react";
import {Family, FamilyPerson} from "~/services/reports/persons";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import {getFamilyName, getCouplePicture} from "../StoryOfUsReport/StoryOfUsReport";
import {Household} from "~/types/api/household";
import moment from "moment";
import {onlyNonUndefined} from "../../../../../utils/filter";
import {formatWork} from "~/ui/components/Contact/ContactCard/tabs/WorkTab";
import {AddressItem} from "~/types/api/addressItem";
import {NextRouter, useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { getFamilyPicture } from "../StoryOfUsReport/StoryOfUs";

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export interface LegacyOfFiveFamilyProps {
    household?: Household;
    family?: Family;
    persons?: Person[];
    hideChildren?: boolean;
    hideHeader?: boolean
    showSiblings?: boolean;
    linkNames?:boolean;
}

export const getPersonName = (person: Person) => {
    // const firstName = person.FirstName ? person.FirstName + ' ' : '';
    // const preferredName = person.PreferredName ? `(${person.PreferredName}) ` : '';
    // const middleName = person.MiddleName ? person.MiddleName + ' ' : '';
    // const lastName = person.LastName ? person.LastName + ' ' : '';
    // return firstName + preferredName + middleName + lastName;

    if(!person) return 'N/A';

    const name = [
        person.PreferredName ? person?.PreferredName : person.FirstName,
        person.OriginalSurname ? `(${person.OriginalSurname})` : undefined,
        person.LastName
    ].filter(onlyNonUndefined).join(" ")

    return name === " " || name === "" ? "No name" : name
}

export const getPersonAge = (person: Person) => {
    if (person.DateOfBirth) {
        if (person.Deceased && person.DateOfBirth) {
            return moment(person?.DateOfDeath).diff(person?.DateOfBirth, 'years')
        } else {
            return moment().diff(person.DateOfBirth, 'years')
        }
    } else {
        return ""
    }
}

export function getWorkItem(person: Person){
    let currentItems = person?.WorkList?.filter(i => i.CurrentlyWorking) ?? []

    if(currentItems.length === 0){
        currentItems = person?.WorkList?.filter(i => !i.EndDate) ?? []

        if(currentItems.length === 0){
            const endedItems = person?.WorkList?.filter(i => !!i.EndDate) ?? []

            if(endedItems.length){
                currentItems = [endedItems.sort((i1, i2) => {
                    const i1d = moment(i1.EndDate)
                    const i2d = moment(i2.EndDate)

                    if(i2d > i1d){
                        return -1
                    }else{
                        return 1
                    }
                })[0]]
            }else{
                currentItems = []
            }
        }
    }

    return currentItems
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
                <div className="bcr-rows-legacy">
                    <p>
                        <span className="grey">Occupation:</span> {formatWork(item)}
                    </p>
                </div>
            ))}
        </>
    )
}

const NameRow = ({person, router}: { person: Person, router?:NextRouter }) => {
    const age = getPersonAge(person)
    return (
        <p>
            <span className="turquoise">
                <span style={{cursor:"pointer"}} onClick={()=>{
                    if(router){
                        router.push(`${paths.CONTACTS}?person=${person.PersonID}`).then(()=>{
                            window.scrollTo(0,0)
                        })
                    }
                }}>{getPersonName(person)} </span>{age !== '' && <>|</>}
            </span>
            {age !== '' &&
                <> <span className="grey">{formatAgeLabel(person)}:</span> {age}</>
            }
        </p>
    )
}

export function formatAddress(item: AddressItem){
    return [
        item.City,
        item.StateRegion,
        item.Country
    ].filter(onlyNonUndefined).join(", ")
}

export function formatAgeLabel(person: Person){
    if(person.Deceased){
        return "Aged"
    }else{
        return "Age"
    }
}

export const AddressRow = ({person}:{person:FamilyPerson}) => {
    const all = person.person?.AddressList ?? []
    const addresses = all.length > 1 ? all.filter(address => address.MainAddress) : all
    if(person.person?.Deceased)
        return null
    return (
        <>
            {addresses.map(item => (
                <div className="bcr-rows-legacy">
                    <p><span className="grey">Residence:</span> {formatAddress(item)}</p>
                </div>
            ))}
        </>
    )
}

/**
 * Primary person table
 * @param person
 * @constructor
 */
export const PrimaryPersonTable = ({person}: { person: FamilyPerson }): ReactElement => {
    return (
        <div className="legacy-flex-column" style={{background: '#CCCCCC'}}>
            <div className="bcr-top-legacy turquoise">
                <p className="left">{getPersonName(person?.person!)}</p>
            </div>
            <div className="bcr-rows-legacy">
                <NameRow person={person.person!}/>
            </div>
            <AddressRow person={person}/>
            <OccupationRow person={person.person}/>
        </div>
    )
}

/**
 * Children person table
 * @param child
 * @constructor
 */
export const ChildrenPersonTable = ({child, router}: { child: FamilyPerson, router?:NextRouter }): ReactElement => {
    return (

        <div className="legacy-flex-column" style={{background: '#CCCCCC'}}>
            {/* <div className="bcr-top-legacy half-width turquoise">
                <p className="left">{child?.person?.FirstName}</p>
            </div> */}
            <div className="bcr-rows-legacy">
                <NameRow person={child.person!} router={router}/>
            </div>
            <OccupationRow person={child.person}/>
            <AddressRow person={child!}/>
            {child.spouse && child?.spouse.person ?
                <>
                    <div className="bcr-rows-legacy">
                        <NameRow person={child.spouse.person!} router={router}/>
                    </div>
                    <OccupationRow person={child.spouse.person}/>
                    <AddressRow person={child.spouse!}/>
                </> : null}
        </div>
    )
}

/**
 * Grandchildren table
 * @param grandchild
 * @constructor
 */
export const GrandchildrenPersonTable = ({grandchild, router}: { grandchild: FamilyPerson, router?:NextRouter }): ReactElement => {
    return (
        <div className="bcr-rows-legacy legacy-mar-b">
            <NameRow person={grandchild.person!} router={router}/>
        </div>
    )
}

export const LegacyOfFiveFamilyProfilePage1 = ({ household, family, hideChildren, showSiblings, hideHeader, linkNames }: LegacyOfFiveFamilyProps): ReactElement => {
    const ids: number[] = [];
    const router = linkNames ? useRouter() : undefined

    const getFamilyNameFromPersons = (person1?: Person, person2?: Person) => {
        if (person1 && person2) return `${person1?.FirstName} and ${person2?.FirstName}`;
        if (person1) return person1?.FirstName;
        return person2?.FirstName;
    }

    return (
        <>
            {!hideHeader &&
                <div className="legacy-profile-top">
                    <div className="legacy-header turquoise">
                        <p><strong>{household?.HouseholdName}</strong></p>
                    </div>
                    {family?.address ? <div>{family?.address?.AddressOneLine}</div> : null}
                    {family?.phonenumber ? <div>{family?.phonenumber?.PhoneNumber}</div> : null}
                </div>
            }

            {/* Primary persons  */}
            <div className="ppw-top-legacy">
                {!hideHeader &&
                <div className="legacy-flex-row legacy-mar-t">
                    {family?.persons?.map(person => person?.person ?
                        <PrimaryPersonTable key={`${person.person.PersonID}-s9`} person={person!}/> : null)}
                </div>
                }

                <div className="legacy-flex-row legacy-mar-t legacy-pad">
                    {family?.persons?.map(person => {
                        return (
                            person?.person ?
                                <div className="legacy-flex-column" style={{background: '#CCCCCC'}}
                                     key={`${person.person.PersonID}-s8`}>
                                    <div className="bcr-top-legacy turquoise">
                                        <p className="left">{person?.person?.FirstName}'s Grandparents</p>
                                    </div>
                                </div> : null
                        )
                    })}
                </div>

                {/* Grandparents */}
                <div className="legacy-flex-row legacy-pad">
                    {family?.persons?.map(person => {
                        return (
                            person?.person ?
                                <div className="legacy-flex-column" key={`${person?.person.PersonID}-s6`}
                                     style={{background: '#CCCCCC'}}>
                                    {person?.parents?.map(parent => {
                                        return (
                                            parent?.person ?
                                                <>
                                                    {parent?.parents?.map(grandParent => {
                                                        return (
                                                            <>
                                                                {grandParent?.person &&
                                                                    <>
                                                                        <div className="bcr-rows-legacy"
                                                                             key={`${person.person?.PersonID} ${parent.person?.PersonID}-s5`}>
                                                                            <NameRow person={grandParent.person!} router={router}/>
                                                                        </div>
                                                                        <OccupationRow person={grandParent.person}/>
                                                                        <AddressRow person={grandParent}/>
                                                                    </>
                                                                }
                                                            </>
                                                        )
                                                    })}
                                                </> : null
                                        )
                                    })}
                                </div> : null
                        )
                    })}
                </div>

                <div className="legacy-flex-row legacy-mar-t legacy-pad">
                    {family?.persons?.map(person => {
                        return (
                            person?.person ?
                                <div className="legacy-flex-column" key={`${person.person.PersonID}-s4`}
                                     style={{background: '#CCCCCC'}}>
                                    <div className="bcr-top-legacy turquoise">
                                        <p className="left">{person?.person?.FirstName}'s Parents</p>
                                    </div>
                                </div> : null
                        )
                    })}
                </div>

                {/* Parents */}
                <div className="legacy-flex-row">
                    {family?.persons?.map(person => {
                        return (
                            person?.person ?
                                <div className="legacy-flex-column" key={`${person.person.PersonID}-s2`}
                                     style={{background: '#CCCCCC'}}>
                                    {person?.parents?.map(parent => {
                                        return (

                                            parent?.person ?
                                                <div key={`${parent.person.PersonID}-s1`}>
                                                    <div className="bcr-rows-legacy">
                                                        <NameRow person={parent.person!} router={router}/>
                                                    </div>
                                                    <OccupationRow person={parent.person}/>
                                                    <AddressRow person={parent}/>
                                                </div> : null

                                        )
                                    })}
                                </div> : null

                        )
                    })}

                </div>

                {showSiblings &&
                <>
                    <div className="legacy-flex-row legacy-mar-t legacy-pad">
                        {family?.persons?.map(person => {
                            return (
                                person?.person ?
                                    <div className="legacy-flex-column" key={`${person.person.PersonID}-ss4`}
                                         style={{background: '#CCCCCC'}}>
                                        <div className="bcr-top-legacy turquoise">
                                            <p className="left">{person?.person?.FirstName}'s Siblings</p>
                                        </div>
                                    </div> : null
                            )
                        })}
                    </div>

                    {/* Siblings */}
                    <div className="legacy-flex-row">
                        {family?.persons?.map(person => {
                            return (
                                person?.person ?
                                    <div className="legacy-flex-column" key={`${person.person.PersonID}-ss2`}
                                         style={{background: '#CCCCCC'}}>
                                        {person?.siblings?.map(parent => {
                                            return (

                                                parent?.person ?
                                                    <div key={`${parent.person.PersonID}-ss1`}>
                                                        <div className="bcr-rows-legacy">
                                                            <NameRow person={parent.person!} router={router}/>
                                                        </div>
                                                        <OccupationRow person={parent.person}/>
                                                        <AddressRow person={parent}/>
                                                    </div> : null

                                            )
                                        })}
                                    </div> : null

                            )
                        })}

                    </div>
                </>
                }
            </div>
        </>
    )
}

export const LegacyOfFiveFamilyProfilePage2 = ({ household, family, hideChildren, showSiblings, hideHeader, linkNames }: LegacyOfFiveFamilyProps): ReactElement => {
    const ids: number[] = [];
    const router = linkNames ? useRouter() : undefined

    const getFamilyNameFromPersons = (person1?: Person, person2?: Person) => {
        if (person1 && person2) return `${person1?.FirstName} and ${person2?.FirstName}`;
        if (person1) return person1?.FirstName;
        return person2?.FirstName;
    }

    return (
        <>
            

            {/* Primary persons  */}
            <div className="ppw-top-legacy">

                {showSiblings &&
                <>
                    <div className="legacy-flex-row legacy-mar-t legacy-pad">
                        {family?.persons?.map(person => {
                            return (
                                person?.person ?
                                    <div className="legacy-flex-column" key={`${person.person.PersonID}-ss4`}
                                         style={{background: '#CCCCCC'}}>
                                        <div className="bcr-top-legacy turquoise">
                                            <p className="left">{person?.person?.FirstName}'s Siblings</p>
                                        </div>
                                    </div> : null
                            )
                        })}
                    </div>

                    {/* Siblings */}
                    <div className="legacy-flex-row">
                        {family?.persons?.map(person => {
                            return (
                                person?.person ?
                                    <div className="legacy-flex-column" key={`${person.person.PersonID}-ss2`}
                                         style={{background: '#CCCCCC'}}>
                                        {person?.siblings?.map(parent => {
                                            return (

                                                parent?.person ?
                                                    <div key={`${parent.person.PersonID}-ss1`}>
                                                        <div className="bcr-rows-legacy">
                                                            <NameRow person={parent.person!} router={router}/>
                                                        </div>
                                                        <OccupationRow person={parent.person}/>
                                                        <AddressRow person={parent}/>
                                                    </div> : null

                                            )
                                        })}
                                    </div> : null

                            )
                        })}

                    </div>
                </>
                }
            </div>
            <div className="ppw-top-legacy">
                {!hideChildren &&
                <>
                    <div className="legacy-flex-row legacy-mar-t legacy-pad">
                        <div className="legacy-flex-column" style={{background: '#CCCCCC'}}>
                            <div className="bcr-top-legacy turquoise">
                                <p className="left">{family?.persons[0] ? getFamilyNameFromPersons(family?.persons[0].person, family?.persons[1].person) : ''}'s
                                    Children</p>
                            </div>
                        </div>
                        <div className="legacy-flex-column" style={{background: '#CCCCCC'}}>
                            <div className="bcr-top-legacy turquoise">
                                <p className="left">{family?.persons[0] ? getFamilyNameFromPersons(family?.persons[0].person, family?.persons[1].person) : ''}'s
                                    Grandchildren</p>
                            </div>
                        </div>
                    </div>

                    {/* Children & Grandchildren               */}

                    {family?.persons?.map(person => {
                        return (
                            person?.children?.map(child => {
                                return (
                                    child?.person && !ids.includes(child?.person?.PersonID) && ids.push(child?.person?.PersonID) ?
                                        <div className="legacy-flex-row"
                                             key={`${person.person?.PersonID}-child-${child.person?.PersonID}`}>
                                            <ChildrenPersonTable child={child}/>
                                            {/* GrandChildren */}
                                            {child?.children && child?.children?.length > 0 ?
                                                <div className="legacy-flex-column legacy-mar-t"
                                                     style={{background: '#CCCCCC'}}>
                                                    {child?.children?.map((grandkid, index) => grandkid?.person ?
                                                        <GrandchildrenPersonTable
                                                            key={`${grandkid.person.PersonID}-${index}`}
                                                            grandchild={grandkid}/> : null)}
                                                </div>
                                                : null}
                                        </div> : null
                                )
                            }))
                    })}
                </>
                }
            </div>
        </>
    )
}

export const LegacyOfFiveFamilyPage1 = (props: LegacyOfFiveFamilyProps): ReactElement => {
    const {household, persons} = props

    const headerProps = {
        showHeader: true,
        title: "Legacy of Five Family Profile",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getFamilyPicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: undefined
      };

    return (
        <>
        <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={headerProps.image} 
          familyName={headerProps.familyName} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/>
        <LegacyOfFiveFamilyProfilePage1 {...props}/>
        </>
    )
}

export const LegacyOfFiveFamilyPage2 = (props: LegacyOfFiveFamilyProps): ReactElement => {
    const {household, persons} = props

    const headerProps = {
        showHeader: true,
        title: "Legacy of Five Family Profile",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getFamilyPicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: undefined
      };

    return (
        <>
        <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={headerProps.image} 
          familyName={headerProps.familyName} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/>
        <LegacyOfFiveFamilyProfilePage2 {...props}/>
        </>
    )
}

/**
 * PDF wrapped legacy of five
 * @param props
 * @constructor
 */
const LegacyOfFiveFamily = (props: LegacyOfFiveFamilyProps): ReactElement => {
    const {household, persons} = props

    const headerProps = {
        showHeader: true,
        title: "Legacy of Five Family Profile",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getFamilyPicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: undefined
      };

    return (
        <>
        <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={headerProps.image} 
          familyName={headerProps.familyName} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/>
        <LegacyOfFiveFamilyProfilePage1 {...props}/>
        {/* <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={headerProps.image} 
          familyName={headerProps.familyName} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/> */}
        <LegacyOfFiveFamilyProfilePage2 {...props}/>
        </>
    )
}


export default LegacyOfFiveFamily;
