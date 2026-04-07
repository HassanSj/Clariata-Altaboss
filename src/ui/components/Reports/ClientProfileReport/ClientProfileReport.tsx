import React, {ReactElement} from "react";
import {Family} from "~/services/reports/persons";
import {Person} from "~/types/api/person";
import {getCouplePicture, getFamilyName, getFamilyPicture} from "../StoryOfUsReport/StoryOfUsReport";
import {Household} from "~/types/api/household";
import moment from "moment";
import {convertStringToDateText, personBirthdate} from "~/ui/constants/utils";
import {formatEducation} from "~/ui/components/Contact/ContactCard/tabs/EducationTab";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { logoBase64, logoBase64WithouText, printBase64 } from '../PDFReportExport/images';
import { Grid, Button} from "@material-ui/core";
import { useRouter } from "next/router";

export interface ClientProfileProps {
    household?: Household;
    family?: Family;
    persons?: Person[];
    isOpen?: boolean;
    onClose?: () => unknown;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAdCAYAAADPa766AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKcSURBVFhH7ZbPbxJREMe//CpQoPwqtDVYabCpaXqpqYkxMSY9ePbiwWNvXrwb/wBj4tGLtx69ai+e9GATE2MMNSGNWis2VsC2LFCg8qvVN8sjwO57Cxwaa8In2TAzOzv7Zd+b2TX9YeAMYOa//5yhEC1DIVp6ds1WqYiPhRyKjTrm3GO4FgzxM2LeZveRPCrDajLhsi+AWbeHnzHGUEimWsHDTwnuNVm5EMOiz8+9buL5HFZ3trnX5MGlBUzaHdyTY7g0z35851YbulGp0eBeG4ppRRCiGiIMhSTLJW51k6785lYbUYyQ1dDyf3TNjMvNrW6mHE5utRHFCFkNLYZC7pyPcqsNbVa31YoUW4rHXzbVg2yK0TktohoierYvrf0Ga1+n2YKww4F5j1eN30/EcXR8rNqjFgseLSyq9oe8gj3WbX7bCCLOUfXoB6kQasV4QcEG+50f8yI4YmcxBdfHw7jo8uDJ9mee2eRebA5fy0W8OdhTxTrMZnZ9DlG2NFd8QWnLtxAuTWsekAhi87CAdXYDalGlVkNYMBcoVqrXUWY573NZrLPBRvmJQl6tRTWN0AlRalW8SO9yT8875QBemw1L/gCPQLUpRk9ABtWk2jJ0S/M8tYvX+xnu6bkaGMftyDR+VSqon5zAzEa5hR30RF6x615mUjxTz3JoErfORbjXjU7I0+SWuhQibk5MYYm9P1Z3vukGGLXvSjSm7iOZGNprd2dmudeNbmnoX4qgl9hyaAJr6Z/SybrGHv8NtpkpV4SsNmE4RzqhN2+FtWviMM8jemhjUg7lDkrfQqZdLmRZx/SCcih3UHR7hNosUxW/wETzQ0trnoiYtDul86TnZO2EPpL6EdLvx1AnAwk5TfreI6fNUIiWMyIE+Au9fCiAp3aqtAAAAABJRU5ErkJggg==";

function row(title: string, content?: any, preContent:any = ":"){
    if(content && content !== ""){
        return <p>{title}{preContent} <strong>{content}</strong></p>
    }else{
        return null
    }
}

function dottedLine(title: string, content?:any, itemNum?: number){
    console.log("Item Number :" + itemNum)
    return (
        <div style={{display: "flex", width: "100%", alignContent: "space-between"}}>
            <div style={{flex: "1"}}>{itemNum == 0 ? title : null}</div>
            <div style={{textAlign: "right", flex: "1", fontWeight: "600"}}>{content}</div>
        </div>
    ) 
}

const ClientProfileReport = ({household, family, persons, isOpen, onClose}: ClientProfileProps): ReactElement => {
    const router = useRouter();
    console.log("Family");
    console.log(family);

    const reportOptions: IReportOptions = {
        title: 'Client Profile Summary',
        storyofus: false,
        familyName: getFamilyName(household, persons),
        familyImage: household ? getCouplePicture(household) : undefined,
        reportLogo: reportLogo,
        customHeader: true,
        header: false,
        isOpen,
        onClose
    }

    const options: PDFExportProps = {
        paperSize: "auto",
        scale: 1,
        fileName: "Client-Profile-Summary",
        keepTogether: ".no-page-break",
        subject: "Discover: Client Profile Summary",
        author: household?.CreatedBy,
      }

    const ids: number[] = [];

    const getPersonName = (person: Person) => {
        const firstName = person.FirstName ? person.FirstName + ' ' : '';
        const preferredName = person.PreferredName ? `(${person.PreferredName}) ` : '';
        const middleName = person.MiddleName ? person.MiddleName + ' ' : '';
        const lastName = person.LastName ? person.LastName + ' ' : '';
        return firstName + preferredName + middleName + lastName;
    }

    return (
        <>
            <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
            router.back()
            }}
            style={{width:"151px", marginLeft:"168px", marginBottom:"15px"}}
            >
                Go Back
            </Button>
            <PDFReportExport options={options} reportOptions={reportOptions}>
            <table className="table-page">
                <tbody>
                    <tr>
                        <td>
                            <div className="client-profile-page">
                                <div className="client-profile-title">
                                    <img className="client-profile-logo" src="/images/reports/Profile.png"></img>
                                    <div className="blue" style={{whiteSpace: "nowrap", fontSize: "12px", fontWeight: "800"}}>Client Profile</div>
                                </div>
                                <div className="client-profile-top">
                                    <img className="client-profile-top-img" src={household ? getCouplePicture(household) : undefined}
                                        alt={household?.HouseholdName ?? "Family picture"}></img>
                                        
                                    <h3 className="client-profile-familyname">{getFamilyName(household, persons)}</h3>
                                        <div className="client-profile-address">
                                            {family?.address ? <>{family?.address?.StreetAddress} {family?.address?.City} {family?.address?.StateRegion} {family?.address?.PostalCode}</>: null}
                                            {family?.phonenumber ? <p>{family?.phonenumber?.PhoneNumber}</p> : null}
                                        </div>
                                </div>
                                <div className="client-profile-row">
                                        {family?.persons?.map(person => {
                                            return (
                                                person?.person ?
                                                    <>
                                                        <div className="client-profile-column">
                                                            <div className="client-profile-primary-header">
                                                                {getPersonName(person?.person)}
                                                            </div>
                                                            { (person.person?.Birthplace || person.person?.DateOfBirth) &&
                                                                <div className="client-profile-primary-details">
                                                                    <div className="client-profile-primary-detail-left">Birthplace: <strong>{person.person?.Birthplace}</strong></div>
                                                                    <div className="client-profile-primary-detail-right">Birthday: <strong>{personBirthdate(person.person)}</strong></div>
                                                                </div>
                                                            }
                                                            {person?.person?.MarriageDate &&
                                                                <div className="client-profile-primary-details">
                                                                    {dottedLine("Marriage Date",convertStringToDateText(person.person?.MarriageDate, Number(person.person?.MarriageDateString)))}
                                                                </div>
                                                            }

                                                            {person?.person?.PhoneNumberListID &&
                                                                (person?.person?.PhoneHome || person?.person?.PhoneMobile || person?.person?.PhoneWork) &&
                                                                <div className="client-profile-primary-details">
                                                                    {person?.person?.PhoneHome &&
                                                                        <>{dottedLine("Home Phone", person?.person?.PhoneHome)}</>
                                                                    }
                                                                    {person?.person?.PhoneMobile &&
                                                                        <>{dottedLine("Cell Phone", person?.person?.PhoneMobile)}</>
                                                                    }
                                                                    {person?.person?.PhoneWork &&
                                                                        <>{dottedLine("Work Phone", person?.person?.PhoneWork)}</>
                                                                    }
                                                                </div>
                                                            }

                                                            {person?.person?.EmailAddress &&
                                                                <div className="client-profile-primary-details">
                                                                    {dottedLine("Email",person?.person?.EmailAddress)}
                                                                </div>
                                                            }

                                                            {person?.person?.EducationListID &&
                                                                <div className="client-profile-primary-details">
                                                                    {family?.educationList?.map((e, i) => {
                                                                        if (e?.PersonID === person?.person?.PersonID) return (
                                                                            dottedLine("Education",formatEducation(e, true), i)
                                                                        )                                                                       
                                                                    })}
                                                                </div>
                                                            }

                                                            {( person.person.Company || person.person.Location) &&
                                                                <div className="client-profile-primary-details">
                                                                    {/*person.person.Occupation ||*/}
                                                                    {/*{person.person.Occupation && <>{dottedLine("Occupation", person?.person?.Occupation)}</>}*/}
                                                                    {person.person.Company && <>{dottedLine("Company", person?.person?.Company)}</>}
                                                                    {person.person.Location && <>{dottedLine("Location", person?.person?.Location)}</>}
                                                                </div>
                                                            }
                                                        </div>
                                                    </> : null
                                            )
                                        })}                                    
                                </div>
                                <div className="client-profile-row">
                                    <div className="client-profile-column">
                                    <div className="client-profile-col-top blue">
                                        <p className="blue">Children</p>
                                    </div>
                                    </div>
                                    <div className="client-profile-column">
                                        <div className="client-profile-col-top orange">
                                            <p className="orange">Grandchildren</p>
                                        </div>
                                    </div>
                                </div>
                                    {family?.persons?.map(person => {
                                        return (
                                            person?.children?.filter(x => x.person?.PersonTypeID != 2).map(child => {
                                                if (child?.person?.PersonID) {
                                                    if (!ids.includes(child?.person?.PersonID)) {
                                                        ids.push(child?.person?.PersonID);
                                                        return (
                                                            <>
                                                            {/* {ids?.length > 1 ? <div className="divider"/> : null} */}
                                                            {ids?.length > 1 ? <hr className="divider" color="#dee0e7" /> : null}
                                                            <div className="client-profile-row">
                                                                    <div className="client-profile-column">
                                                                        <div className="client-profile-child-details">
                                                                            <p className="blue">
                                                                                <strong>{getPersonName(child?.person)}</strong>
                                                                            </p>
                                                                            <div style={{display: "flex"}}>
                                                                                <div style={{flex: "1"}}>Phone: <strong>{child?.person?.PhoneHome}</strong>
                                                                                </div>
                                                                                <div style={{flex: "1"}}>Birthday: <strong>{personBirthdate(child.person)}</strong>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    
                                                                    {child.spouse && child?.spouse.person ?
                                                                        <div className="client-profile-child-details">
                                                                            <p className="blue">
                                                                                <strong>{getPersonName(child?.spouse?.person)}</strong>
                                                                            </p>
                                                                            <div style={{display: "flex"}}>
                                                                                <div style={{flex: "1"}}>Phone: <strong>{child?.spouse?.person?.PhoneHome}</strong>
                                                                                </div>
                                                                                <div style={{flex: "1"}}>Birthday: <strong>{personBirthdate(child?.spouse?.person)}</strong>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        : null}
                                                                    </div>
                                                                    <div className="client-profile-column">
                                                                        {child?.children ?                                                                    
                                                                        <div>
                                                                        {child?.children?.map(grandChild => {
                                                                            if (grandChild.person) {
                                                                                return (
                                                                                    <div className="client-profile-grandchild-details">
                                                                                        <p className="orange">
                                                                                            <strong>{getPersonName(grandChild?.person)}</strong>
                                                                                        </p>
                                                                                        <div style={{display: "flex"}}>
                                                                                            <div style={{flex: "1"}}>Phone: <strong>{grandChild?.person?.PhoneHome}</strong>
                                                                                            </div>
                                                                                            <div style={{flex: "1"}}>Birthday: <strong>{personBirthdate(grandChild.person)}</strong>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </div>
                                                                    : null}
                                                                    </div>
                                                                
                                                            </div>
                                                            </>
                                                        )
                                                    }
                                                }
                                            })                                          
                                        
                                    )
                                })}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            </PDFReportExport>
        </>
    )
}


export default ClientProfileReport;
