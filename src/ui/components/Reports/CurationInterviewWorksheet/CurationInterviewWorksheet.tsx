import { ReactElement, useEffect, useState } from "react"
import { isNullOrUndefined } from "util"
import api from "~/services/api"
import { Household } from "~/types/api/household"
import { Objective } from "~/types/api/models"
import { Person } from "~/types/api/person"
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport"
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import moment from "moment"
import { Timing, Importance, KnowledgeNeeded, PersonalImpactLevel, InstallmentFrequency, FundingKnown, KnowledgeTask } from './constants'
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import ReportWrapper from "../ReportWrapper/ReportWrapper"
import { Priority } from "~/types/api/priority"
import { PersonType } from "~/ui/constants/api"
import objective from "~/store/objective"
import { useStoreState } from "~/store/hooks"
import Loader from "../../Loader"
import { Button, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@material-ui/core"
import EmptyContainer from "../../Containers/EmptyContainer"
import useMountEvents from "~/ui/hooks/useMountEvents"
import router from "next/router";

export interface CurationInterviewWorksheetProps {
    household?: Household;
    persons?: Person[];
    curationPriorities?: any;
    isOpen?: boolean;
    onClose?: () => unknown;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getCurationInterviewData = async (householdId: number, interviewId: number) => {

    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
    const selectedObjectives = await api.objective.getSelectedList(householdId);

    return {
        household: household?.data,
        persons: persons?.data,
        curationPriorities: selectedObjectives.data,
    };
}

const CurationInterviewWorksheet = ({ household, persons, isOpen, curationPriorities, onClose }: CurationInterviewWorksheetProps): ReactElement => {
    const [data, setData] = useState<Objective[]>([]);
    const  {SelectedObjectiveList}  = curationPriorities;
    const [ObjectivesDetail, setObjectivesDetail] = useState<Objective>();
    const { dreamInterviewId } = useStoreState(state => state.selected);
    const [loading, setLoading] = useState<boolean>(false);
    // const interviewID = interviews[0].Interview.InterviewID;
    //const ObjectiveID = curationPriorities?[0].ObjectiveID;
    //const HouseholdID = curationPriorities[0].HouseholdID;
    let responseData: any | undefined;
    let tempdata: any[] = [];
    let dateValidation: any[] = [];

    const getObjectivesList = async () => {
        try {

            console.log(SelectedObjectiveList);
            let objectives: Objective[] = [];

            await Promise.all(SelectedObjectiveList?.map(async (data: any, i:number) => {            
                let objective = await api.objective.getFull(Number(household?.HouseholdID), dreamInterviewId, data?.ObjectiveID);
                objectives.push(objective);
            }));
            return objectives;
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleObjectiveListChange = (e:any) => {
        const objectiveID = e?.target?.value;
        const selectedObjective = data?.find((obj) => obj?.ObjectiveID == objectiveID);
        setObjectivesDetail(selectedObjective);
    }

    // useEffect(() => {
    //     getObjectivesList();
    //     if(data?.length > 0){
    //         setObjectivesDetail(data[0]);
    //     }
    // }, []);
    useMountEvents({
        onMounted: async () => {
            setLoading(true);
            const objectives = await getObjectivesList();
            const sorted = objectives?.sort((a,b) => Number(a?.Rank) - Number(b?.Rank));
            if (sorted) {
              setObjectivesDetail(sorted[0]);
              setData(sorted);
            }
            setLoading(false);
        },
    });

    const reportOptions: IReportOptions = {
        title: 'Curation Interview Worksheet',
        storyofus: true,
        reportLogo: reportLogo,
        familyName: getFamilyName(household, persons),
        familyImage: household ? getCouplePicture(household) : undefined,
        isOpen,
        onClose,
        header: true,
    }

    const options: PDFExportProps = {
        paperSize: "auto",
        fileName: "Curation-Interview-Worksheet",
        scale: 1,
        subject: "Direction: Curation Interview Worksheet",
        author: household?.CreatedBy,
        keepTogether: ".keep-together",
        landscape: false,
    }

    const headerProps = {
        showHeader: true,
        title: "Curation Interview Worksheet",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getCouplePicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: reportLogo
        };

    return (
        <>
        {
        !loading
        ?
        <>
            <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                router.back();
                }}
                style={{ width: '151px', marginLeft: '0px', marginBottom: '15px' }}
            >
                Go Back
            </Button>
            <div style={{marginTop: "25px", marginLeft: "167px", marginRight: "auto", marginBottom: "20px", width: "600px" }}>
            <InputLabel id="demo-simple-select-label">Please Select a Priority</InputLabel>
                <Select
                    native={false}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth={true}
                    style={{height:"40px",borderRadius: "5px", backgroundColor: "white" }}
                    onChange={handleObjectiveListChange}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        },
                        getContentAnchorEl: null
                    }}
                    input={<OutlinedInput label="Tag"/>}
                    value={ObjectivesDetail?.ObjectiveID}
                    renderValue={(selected: any) => {
                        return (
                            ObjectivesDetail?.Description
                        )
                    }}
                >
                    {
                        data?.map((item:Objective,i)=>{
                            return(
                                <MenuItem key={i} value={item?.ObjectiveID} selected={item?.ObjectiveID == ObjectivesDetail?.ObjectiveID ? true : false}>
                                    <ListItemText primary={item?.Description}/>
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            </div>
            {
                ObjectivesDetail
                ?
                <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
                <div style={{marginTop:"20px", marginLeft: "auto", marginRight: "auto"}}>
                    <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} includePageBreak={true} >
                        <Header showHeader={headerProps.showHeader}
                            title={headerProps.title} 
                            subTitle={headerProps.subTitle}
                            image={headerProps.image} 
                            familyName={headerProps.familyName} 
                            headerNoRight={headerProps.headerNoRight} 
                            reportLogo={headerProps.reportLogo}
                            worksheet={headerProps.worksheet}
                            storyofus={headerProps.storyofus}/>
                        <div className="curationinterview-body-copy">
                            <div><span style={{ fontWeight: "bold" }}>Priority:&nbsp; </span>{ObjectivesDetail ? ObjectivesDetail.Description : ""}</div>
                            <table className="curationinterview-table" style={{ textAlign: "left" }} cellPadding="0" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="curationinterview-td-shaded curationinterview-question">
                                            <span className="curationinterview-title">DIY or Assisted:</span>Do you need assistance or
                                            are you going to do it yourself?
                                        </td>
                                        <td className="curationinterview-answer curationinterview-td-shaded">{ObjectivesDetail?.DIY ? "DIY" : "Assisted"}</td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-question"><span className="curationinterview-title">
                                            Champion: </span> Who, in your family, will take the
                                            lead on pursuing this priority?</td>
                                        <td className="curationinterview-answer">{ObjectivesDetail?.ChampionPerson ? ObjectivesDetail?.ChampionPerson?.PreferredName ? ObjectivesDetail.ChampionPerson?.PreferredName : ObjectivesDetail.ChampionPerson?.FirstName + " " + ObjectivesDetail.ChampionPerson?.LastName : ""} </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded">
                                            <span className="curationinterview-title">Family Member Stakeholders: </span> Who else in
                                            the family will be involved?</td>
                                        <td className="curationinterview-answer curationinterview-td-shaded"> 
                                            { ObjectivesDetail?.Stakeholders?.filter(x => x.Person?.PersonTypeID == PersonType.FAMILY).map(person => {
                                                return <div>{person.Person?.FirstName} {person.Person?.LastName}</div>
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-question"><span className="curationinterview-title">External Stakeholder:</span> Who else besides the
                                            family should be involved?</td>
                                        <td className="curationinterview-answer">
                                        { ObjectivesDetail?.Stakeholders?.filter(x => x.Person?.PersonTypeID == PersonType.PROFESSIONAL || x.Person?.PersonTypeID == PersonType.OTHER).map(person => {
                                                return <div>{person.Person?.FirstName} {person.Person?.LastName}</div>
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded"><span className="curationinterview-title">Start Date:</span> When would you like to start
                                            working on this priority?
                                        </td>

                                        <td className="curationinterview-answer curationinterview-td-shaded">{
                                            ObjectivesDetail?.StartDate && moment(ObjectivesDetail?.StartDate, "YYYY/MM/DD")
                                                ? moment(ObjectivesDetail.StartDate).format("DD/MM/YYYY")
                                                : ""
                                        } </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-question"><span className="curationinterview-title">End Date: </span> When would you want to achieve
                                            (complete) this priority?</td>

                                        <td className="curationinterview-answer">{
                                            ObjectivesDetail?.ProjectedEndDate && moment(ObjectivesDetail?.ProjectedEndDate, "YYYY/MM/DD")
                                                ? moment(ObjectivesDetail.ProjectedEndDate).format("DD/MM/YYYY")
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded"><span className="curationinterview-title">Timing:</span> How often whould you like to work on
                                            this priority?</td>
                                        <td className="curationinterview-td-shaded">
                                            <div className="curationinterview-flex">
                                                {Timing.map((data, index) => {
                                                    return (
                                                        data ?
                                                            <div className={Timing[Number(ObjectivesDetail?.TimeframeID)] == data ? "selectedOption curationinterview-timing" : "curationinterview-timing curationinterview-td-shaded"} key={index}>
                                                                {data}
                                                            </div> : null
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded"> <div className="curationinterview-indent">Amount of time per occurance? (hours) </div></td>
                                        <td className="curationinterview-answer curationinterview-td-shaded">{ObjectivesDetail?.AmountOfTimeNeeded ? ObjectivesDetail?.AmountOfTimeNeeded : ""} </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded">  <div className="curationinterview-indent">Other Scheduling Details: (notes)</div></td>
                                        <td className="curationinterview-answer curationinterview-td-shaded"> {ObjectivesDetail?.ScheduleDetail ? ObjectivesDetail?.ScheduleDetail : ""}</td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-question"><span className="curationinterview-title">Knowledge:</span> Do you know what it would take
                                            to pursue this priority? </td>
                                        <td className="curationinterview-answer"> {ObjectivesDetail?.KnowledgeYesNo ? "Yes" : "No"}</td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-question"><div className="curationinterview-indent">
                                            What level of knowledge do you need to
                                            pursue the priority?
                                            </div>
                                            </td>
                                        {/* <td> {(ObjectivesDetail?.KnowledgeNeeded >= 1) ? KnowledgeNeeded[ObjectivesDetail?.KnowledgeNeeded] : KnowledgeNeeded[ObjectivesDetail?.KnowledgeNeeded]}</td> */}
                                        <td>
                                            <div className="curationinterview-flex">
                                                {KnowledgeNeeded.map((data, index) => {
                                                    return (
                                                        data ?
                                                            <div className={KnowledgeNeeded[Number(ObjectivesDetail?.KnowledgeNeeded)] == data ? "selectedOption curationinterview-KnowledgeNeeded" : "curationinterview-KnowledgeNeeded"} key={index}>
                                                                {data}
                                                            </div> : null
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><div className="curationinterview-indent">What needs to be done to get you to the
                                            knowledge you need to pursue this priority?</div>
                                            </td>
                                        <td>
                                            <div className="curationinterview-flex">
                                                {KnowledgeTask.map((data, index) => {
                                                    return (
                                                        data ?
                                                            <div className={KnowledgeTask[Number(ObjectivesDetail?.KnowledgeTask)] == data ? "selectedOption curationinterview-KnowledgeTask" : "curationinterview-KnowledgeTask"} key={index}>
                                                                {data}
                                                            </div> : null
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><div className="curationinterview-indent">How can I help you get that level of
                                            knowledge?</div></td>
                                        <td>{ObjectivesDetail?.KnowledgeAdvisorHelp ? ObjectivesDetail?.KnowledgeAdvisorHelp : ""} </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded"><span className="curationinterview-title">Impact of Personal Experience:</span> How will
                                            your personal experiences impact this priority?</td>
                                        <td className="curationinterview-td-shaded">
                                            <div className="curationinterview-flex">
                                                {PersonalImpactLevel.map((data, index) => {
                                                    return (
                                                        data ?
                                                            <div className={PersonalImpactLevel[Number(ObjectivesDetail?.PersonalImpactLevel)] == data ? "selectedOption curationinterview-PersonalImpactLevel" : "curationinterview-PersonalImpactLevel"} key={index}>
                                                                {data}
                                                            </div> : null
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded"> <span style={{ fontWeight: '400' }}>What of your previous experiences will help
                                            you pursue this priority?</span></td>
                                            <td className="curationinterview-td-shaded">{ObjectivesDetail?.PersonalExperience ? ObjectivesDetail?.PersonalExperience : ""}</td>
                                    </tr>
                                    <tr>
                                        <td><span className="curationinterview-title">Funding:</span> What do you think the funding needs
                                            will be to pursue this priority?</td>
                                        <td>
                                            <div className="curationinterview-flex">
                                                {FundingKnown.map((data, index) => {
                                                    return (
                                                        data ?
                                                            <div className={FundingKnown[Number(ObjectivesDetail?.FundingKnown)] == data ? "selectedOption curationinterview-FundingKnown" : "curationinterview-FundingKnown"} key={index}>
                                                                {data}
                                                            </div> : null
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><div className="curationinterview-indent"><span className="curationinterview-title">Total Funding:</span> What is the total amount?</div></td>
                                        <td className="curationinterview-answer">{(Number(ObjectivesDetail?.TotalFundingAmount) > 0) ? "$" + ObjectivesDetail?.TotalFundingAmount : ""} </td>
                                    </tr>
                                    <tr>
                                        <td><div className="curationinterview-indent"><span className="curationinterview-title">Funding Details:</span>One time or installments?</div></td>
                                        {/* <td>{(ObjectivesDetail?.InstallmentFrequency >= 1) ? InstallmentFrequency[ObjectivesDetail?.InstallmentFrequency] : InstallmentFrequency[ObjectivesDetail?.InstallmentFrequency]} </td> */}
                                        <td>
                                            <div className="curationinterview-flex">
                                                {
                                                    (ObjectivesDetail?.InstallmentFrequency
                                                    &&
                                                    ObjectivesDetail?.InstallmentFrequency >=1
                                                    &&
                                                    ObjectivesDetail?.InstallmentFrequency <=7)
                                                    ?
                                                    <>
                                                    <div className={"curationinterview-InstallmentFrequency-Updated"}>
                                                        {"Single Payment"}
                                                    </div>
                                                    <div className={"selectedOption curationinterview-InstallmentFrequency-Updated"}>
                                                    {"Installments"}
                                                    </div>
                                                    <div className={"curationinterview-InstallmentFrequency-Updated"}>
                                                    {InstallmentFrequency[Number(ObjectivesDetail?.InstallmentFrequency)]}
                                                    </div>
                                                    <div className={"curationinterview-InstallmentFrequency-Updated"}>
                                                    {ObjectivesDetail?.InstallmentAmount}
                                                    </div>
                                                    </>
                                                    :
                                                    <>
                                                    <div className={"selectedOption curationinterview-InstallmentFrequency-Updated"}>
                                                        {"Single Payment"}
                                                    </div>
                                                    <div className={"curationinterview-InstallmentFrequency-Updated"}>
                                                    {"Installments"}
                                                    </div>
                                                    <div className={"curationinterview-InstallmentFrequency-Updated"}>
                                                    {"Once, Daily, Weekly, Biweekly, Monthly, Quarterly, Annually"}
                                                    </div>
                                                    <div className={"curationinterview-InstallmentFrequency-Updated"}>
                                                    {"Amount"}
                                                    </div>
                                                    </>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="curationinterview-td-shaded"> <span className="curationinterview-title">Importance:</span>How would you characterize this
                                            priority?</td>
                                        <td className="curationinterview-td-shaded">
                                            <div className="curationinterview-flex">
                                                {Importance.map((data, index) => {
                                                    return (
                                                        data ?
                                                            <div className={Importance[Number(ObjectivesDetail?.Importance)] == data ? "selectedOption curationinterview-Importance" : "curationinterview-Importance"} key={index}>
                                                                {data}
                                                            </div> : null
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <span className="curationinterview-title">What does success look like?</span></td>
                                        <td className="curationinterview-answer">{ObjectivesDetail?.SuccessDescription ? ObjectivesDetail?.SuccessDescription : ""}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ReportWrapper>
                </div>
                </PDFReportExport>
                :
                <div style={{ margin: "159px 311px 105px 120px" , padding: "null !important" , width : "null !important"}}>
                <EmptyContainer text={"No Priorities Selected"}></EmptyContainer>
                </div>
            }
        </>
        :
        <Loader/>
        } 
        </>
    )

}

export default CurationInterviewWorksheet;
