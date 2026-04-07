import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import {IPDFReportOptions, logoBase64WithouText} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import {getFamilyName, getFamilyPicture} from "../StoryOfUsReport/StoryOfUsReport";
import {Household} from "~/types/api/household";
import api from "~/services/api";
import {Objective} from "~/types/api/models";
import {getPhotoUrlOrDefault} from "~/ui/constants/user";
import {getChartData} from "../LifeGraphReport/LifeGraphReport";
import DonutChart from "../../Charts/DonutChart";
import DreamLogo from "./images/Clariata5DIcon_Dream.png";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import PDFReportExport, { IReportOptions } from "../PDFReportExport/PDFReportExport";
import { Grid } from "@material-ui/core";
import { getChartImages } from "../LifeGraphReport/LifeGraphReport";

export interface WhyData {
    objectiveId: number;
    why?: string;
}

export interface DreamLifePrintProps {
    household?: Household;
    persons?: Person[];
    objectives?: Objective[];
    familyPriorities?: Objective[];
    workLifePriorities?: Objective[];
    communityPriorities?: Objective[];
    person1Priorities?: Objective[];
    person2Priorities?: Objective[];
    additionalPriorities?: Objective[];
    whyData?: WhyData[];
    chartData?: {
        value: number,
        color: string,
        category?: string
    }[][];
    chartImages: string[];
    owner: string;
    isOpen?: boolean;
    onClose?: () => unknown;
}

export interface SelectedPriorities {
    person1Objs: string[],
    person2Objs: string[],
    familyPriorities: string[],
    workPriorities: string[],
    communityPriorities: string[],
    additionalPriorities: string[]
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param selectedPriorities
 */
export const getDreamLifePrintData = async (householdId: number, interviewId: number, selectedPriorities: SelectedPriorities) => {

    // Fetch data
    const householdResponse = await api.household.get(householdId);
    const household = await householdResponse.data;
    const persons = await api.person.list(householdId);
    const objectives = await api.objective.list(householdId, interviewId);
    const metrics = await api.metricofsuccess.list();
    const dimensions = await api.dimensionofsuccess.list();

    // update objectives with dimension/metric names:
    objectives?.data?.forEach(o => {
        o.DimensionOfLife = dimensions?.data?.find(d => d?.DimensionOfLifeID === o?.DimensionOfLifeID);
        o.MetricOfSuccess = metrics?.data?.find(m => m?.MetricOfSuccessID === o?.MetricOfSuccessID);
    })

    const whyData: WhyData[] = [];

    for (const o of objectives?.data) {
        console.log(o)
        if (o?.InterviewResponseID) {
            const response = await api.interviewresponse.get(householdId, interviewId, o?.InterviewResponseID);
            const whyItem: WhyData = {
                objectiveId: o?.ObjectiveID,
                why: response.data?.WhyIsThisImportant
            }
            whyData.push(whyItem);
        }
    }

    const primaryPersons = persons?.data?.filter(p => p?.PersonID === household?.PrimaryPerson1ID || p?.PersonID === household?.PrimaryPerson2ID);
    const chartData: { value: number, color: string, category?: string }[][] = await getChartData(household, householdId, interviewId, false);
    const chartImages = await getChartImages(chartData, primaryPersons, household, true, true, false, "#fff", 10);
    // const chartImage = {value:number, color:string, category?:string }[][], persons?: Person[], household?: Household, isMetric?: boolean, showLabels?: boolean, noText?: boolean, backgroundColor?: string, ringSize?: number
    const objectiveFilter = (list: string[]) => {
        return (o: Objective) => list.includes(String(o.ObjectiveID))
    }

    // const familyPriorities = objectives?.data?.filter(o => o?.DimensionOfLifeID === 2).slice(0,3);
    const familyPriorities = objectives?.data?.filter(objectiveFilter(selectedPriorities.familyPriorities))
    // const workLifePriorities = objectives?.data?.filter(o => o?.DimensionOfLifeID === 3).slice(0,3);
    const workLifePriorities = objectives?.data?.filter(objectiveFilter(selectedPriorities.workPriorities))
    // const communityPriorities = objectives?.data?.filter(o => o?.DimensionOfLifeID === 4).slice(0,3);
    const communityPriorities = objectives?.data?.filter(objectiveFilter(selectedPriorities.communityPriorities))

    const person1Priorities = objectives?.data?.filter(objectiveFilter(selectedPriorities.person1Objs))
    const person2Priorities = objectives?.data?.filter(objectiveFilter(selectedPriorities.person2Objs))
    const additionalPriorities = objectives?.data?.filter(objectiveFilter(selectedPriorities.additionalPriorities))

    const owner = await getOwner(household);

    const ownerName = owner.owner.FirstName + " " + owner.owner.LastName;

    console.log(chartData);
    console.log(chartImages);

    return {
        household: household,
        persons: primaryPersons,
        objectives: objectives?.data,
        familyPriorities,
        workLifePriorities,
        communityPriorities,
        person1Priorities,
        person2Priorities,
        additionalPriorities,
        whyData,
        chartData,
        chartImages,
        owner: ownerName
    };
}

const getOwner = async (household: Household) => {

    let ownerId = String(household.CreatedBy);
    const ownerResponse = await api.user.getUser(ownerId);
    const owner = await ownerResponse.data;

    return {
        owner
    }
}


const DreamLifePrint = ({
                            household,
                            persons,
                            objectives,
                            familyPriorities,
                            workLifePriorities,
                            communityPriorities,
                            person2Priorities,
                            person1Priorities,
                            additionalPriorities,
                            whyData,
                            chartData,
                            chartImages,
                            owner,
                            isOpen,
                            onClose
                        }: DreamLifePrintProps): ReactElement => {


    const getPersonName = (personId?: number) => {
        if (personId) {
            if (personId === 0) return "Both";
            const p = persons?.find(p => p?.PersonID === personId);
            return p?.PreferredName ? p?.PreferredName : p?.FirstName;
            //return p?.PreferredName ?? p?.FirstName;
        }
        return " "
    }


    const getChartTitle = (personId: number) => {
        const metric = "DIMENSIONS";
        const person = personId == 0 ? "COMBINED" : "" + persons?.find(p => p.PersonID == personId)?.FirstName?.toUpperCase() + "'S";

        return {
            line2: metric,
            line3: "OF SUCCESS"
        }
    }

    const nowPriorities      = additionalPriorities?.filter(o => o?.TimeframeID === 1)
    const laterPriorities    = additionalPriorities?.filter(o => o?.TimeframeID === 2)
    const longTermPriorities = additionalPriorities?.filter(o => o?.TimeframeID === 3)

    const reportOptions: IReportOptions = {
        storyofus: true,
        title: "Dream LifePrint",
        familyName: getFamilyName(household, persons),
        familyImage: household ? getFamilyPicture(household) : undefined,
        isOpen,
        onClose,
        header: false,
        }

        const options: PDFExportProps = {
        paperSize: "auto",
        fileName: "Dream-LifePrint",
        scale: 1,
        subject: 'Dream LifePrint',
        author: household?.CreatedBy,
        keepTogether: "keep-together",
        landscape: false,
        }
    console.log()
    return (
        <>
            <PDFReportExport reportOptions={reportOptions} options={options} excludeFooter={true}>
            <table style={{width: "35.5in", maxHeight: "23.5in", margin: "10px", padding: "10px", border: "thin solid #ffffff"}}>
                <tbody>
                    <tr>
                        <td style={{width: "35in", verticalAlign: "top", minHeight: "2in", overflow: "-moz-hidden-unscrollable", marginRight: "10px"}} className="dlpr-col-50 dlpr-border dlpr-timeline">
                            <Grid container className="blue-bg-color">
                                <Grid item xs={3}>
                                    <div style={{textAlign: "center", color: "#ffffff", fontSize: "40px", border: "#ffffff thin solid", margin: "10px", minHeight: "100px", alignContent: "middle"}}>Experience</div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div style={{textAlign: "center", color: "#ffffff", fontSize: "40px", border: "#ffffff thin solid", margin: "10px", minHeight: "100px"}}>Achievement</div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div style={{textAlign: "center", color: "#ffffff", fontSize: "40px", border: "#ffffff thin solid", margin: "10px", minHeight: "100px"}}>Impact</div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div style={{textAlign: "center", color: "#ffffff", fontSize: "40px", border: "#ffffff thin solid", margin: "10px", minHeight: "100px"}}>Legacy</div>
                                </Grid>
                            </Grid>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "35in", verticalAlign: "top", minHeight: "8in", overflow: "-moz-hidden-unscrollable", marginRight: "10px"}} className="dlpr-col-50 dlpr-border dlpr-timeline">
                        <div className="equalHMVWrap eqWrap">
                            {household?.Persons?.map((p, i) => {
                                return (
                                    <div className="equalHMV eq cl-border">

                                        <div className="equal-half-wrap">
                                            <div className="equal-half-left">

                                                <div className="dream-card">
                                                    <div className="dream-card-img">
                                                        <img crossOrigin="anonymous" src={getPhotoUrlOrDefault(p)} />
                                                    </div>
                                                    <div className="dream-info">
                                                        <p className="dream-date">
                                                            <strong>{p?.PreferredName ? p?.PreferredName : p?.FirstName}</strong>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="dream-chart">
                                                    {chartData && chartData[p?.PersonID] ?
                                                        <DonutChart data={chartData[p?.PersonID]} chartDiameter={800}
                                                                    showLegend={true} {...getChartTitle(p?.PersonID)}
                                                                    lifePrint={true}/> : null}
                                                    {/* <img src={chartImages[i]}/> */}
                                                </div>
                                                {/* <div className="lifegraph-three-charts-legend">
                                                    {chartData ? chartData?.find(cd=>cd!==undefined)?.map(cd => {
                                                        return (
                                                        <div className="lifegraph-three-chart-item">
                                                            <span style={{ backgroundColor: cd?.color }}/> {cd?.category}
                                                        </div>
                                                        )
                                                    }) : null }
                                                </div> */}

                                            </div>

                                            <div className="equal-half-right">

                                                {(i === 0 ? person1Priorities : person2Priorities)?.map(o => {
                                                    const why = whyData?.find(d => d?.objectiveId === o?.ObjectiveID);
                                                    console.log(why);
                                                    return (
                                                        <div className="blue-card">
                                                            {o?.SuccessImageURL ?
                                                                <div className="blue-card-img">
                                                                    <img src={o?.SuccessImageURL} crossOrigin="anonymous"/>
                                                                </div> :
                                                                <div style={{backgroundColor: "#F1F0F0", height: "350px", width: "350px", padding: "25px", border: "thin thin #000"}}>

                                                                </div>}
                                                            <div className="blue-card-body">
                                                                <div className="blue-card-title">
                                                                    <div className="blue-card-left"><p>
                                                                        <strong>Metric:</strong> {o?.MetricOfSuccess?.MetricOfSuccess}
                                                                    </p></div>
                                                                </div>
                                                                <div className="blue-card-text">
                                                                    <h4><strong>Priority:</strong> {o?.Description}</h4>
                                                                    <p><strong>Why?</strong> {why?.why}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )

                                                })}

                                            </div>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{width: "35in", verticalAlign: "top", maxHeight: "10in", overflow: "-moz-hidden-unscrollable", marginRight: "10px"}} className="dlpr-col-50 dlpr-border dlpr-timeline">
                        <div className="blue-4-cols">
                            <div className="blue-4-cols-sm">
                                <h3 className="blue-heading">Family</h3>

                                {familyPriorities?.map(o => {
                                    return (
                                        <div className="blue-card">
                                            {o?.SuccessImageURL ?
                                                <div className="blue-card-img">
                                                    <img src={o?.SuccessImageURL} crossOrigin="anonymous" alt="Card image"/>
                                                </div> :
                                                <div style={{backgroundColor: "#F1F0F0", height: "350px", width: "350px", padding: "25px", border: "thin thin #000"}}>
                                                </div>
                                                    }
                                            <div className="blue-card-body">
                                                <div className="blue-card-title">
                                                    <div className="blue-card-left"><p>
                                                        <strong>Metric:</strong> {o?.MetricOfSuccess?.MetricOfSuccess}
                                                    </p></div>
                                                    <div className="blue-card-right"><p>
                                                        <strong>Who:</strong> {o?.PersonID ? getPersonName(o?.PersonID) : "BOTH" }</p></div>
                                                </div>
                                                <div className="blue-card-text">
                                                    <h4><strong>Priority:</strong> {o?.Description}</h4>
                                                    <p>
                                                        <strong>Why?</strong> {whyData?.find(d => d?.objectiveId === o?.ObjectiveID)?.why}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}


                            </div>
                            <div className="blue-4-cols-sm">
                                <h3 className="orange-heading">Work Life</h3>

                                {workLifePriorities?.map(o => {
                                    console.log(whyData);
                                    return (
                                        <div className="blue-card">
                                            {o?.SuccessImageURL ?
                                                <div className="blue-card-img">
                                                    <img src={o?.SuccessImageURL} crossOrigin="anonymous" alt="Card image"/>
                                                </div> :
                                                <div style={{backgroundColor: "#F1F0F0", height: "350px", width: "350px", padding: "25px", border: "thin thin #000"}}>
                                                    </div>
                                                    }
                                            <div className="blue-card-body">
                                                <div className="blue-card-title">
                                                    <div className="blue-card-left"><p>
                                                        <strong>Metric:</strong> {o?.MetricOfSuccess?.MetricOfSuccess}
                                                    </p></div>
                                                    <div className="blue-card-right"><p>
                                                        <strong>Who:</strong> {o?.PersonID ? getPersonName(o?.PersonID) : "BOTH"}</p></div>
                                                </div>
                                                <div className="blue-card-text">
                                                    <h4><strong>Priority:</strong> {o?.Description}</h4>
                                                    <p>
                                                        <strong>Why?</strong> {whyData?.find(x => x.objectiveId == o.ObjectiveID)?.why}
                                                        {/* whyData?.find(d => d?.objectiveId === o?.ObjectiveID)?.why */}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}


                            </div>
                            <div className="blue-4-cols-sm">
                                <h3 className="blue2-heading">Community</h3>

                                {communityPriorities?.map(o => {
                                    return (
                                        <div className="blue-card">
                                            {o?.SuccessImageURL ?
                                                <div className="blue-card-img">
                                                    <img src={o?.SuccessImageURL} crossOrigin="anonymous" alt="Card image"/>
                                                </div> :
                                                <div style={{backgroundColor: "#F1F0F0", height: "350px", width: "350px", padding: "25px", border: "thin thin #000"}}>
                                                    </div>
                                                    }
                                            <div className="blue-card-body">
                                                <div className="blue-card-title">
                                                    <div className="blue-card-left"><p>
                                                        <strong>Metric:</strong> {o?.MetricOfSuccess?.MetricOfSuccess}
                                                    </p></div>
                                                    <div className="blue-card-right"><p>
                                                        <strong>Who:</strong> {getPersonName(o?.PersonID) ? getPersonName(o?.PersonID): "BOTH"}</p></div>
                                                </div>
                                                <div className="blue-card-text">
                                                    <h4><strong>Priority:</strong> {o?.Description}</h4>
                                                    <p>
                                                        <strong>Why?</strong> {whyData?.find(d => d?.objectiveId === o?.ObjectiveID)?.why}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}


                            </div>
                            <div className="blue-4-cols-lg">
                                <div className="blue" style={{fontSize: "18px", fontWeight: "600", marginBottom: "15px"}}>Additional Priorities</div>

                                {(nowPriorities?.length ?? 0) > 0 &&
                                    <table className="dream-table no-numbers">
                                        <thead>
                                        <tr>
                                            <th>Now</th>
                                            <th>Who</th>
                                            <th>Dimension</th>
                                            <th>Metric</th>
                                            <th>DIY</th>
                                            <th>Assisted</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {nowPriorities?.map(o => {
                                            return (
                                                <tr>
                                                    <td style={{width: "40%"}}>{o?.Description}</td>
                                                    <td style={{width: "15%"}}>{getPersonName(o?.PersonID)}  </td>
                                                    <td style={{width: "15%"}}>{o?.DimensionOfLife?.DimensionOfLife}</td>
                                                    <td style={{width: "15%"}}>{o?.MetricOfSuccess?.MetricOfSuccess}</td>
                                                    <td style={{width: "5%", textAlign: "center"}}>{o?.DIY ? '•' : ''}</td>
                                                    <td style={{width: "5%", textAlign: "center"}}>{o?.AssistanceNeeded ? '•' : ''}</td>
                                                </tr>
                                            )
                                        })}

                                        </tbody>
                                    </table>
                                }
                                {(laterPriorities?.length ?? 0) > 0 &&
                                    <table className="dream-table no-numbers">
                                        <thead>
                                        <tr>
                                            <th>Later</th>
                                            <th>Who</th>
                                            <th>Dimension</th>
                                            <th>Metric</th>
                                            <th>DIY</th>
                                            <th>Assisted</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {laterPriorities?.map(o => {
                                            return (
                                                <tr>
                                                    <td style={{width: "40%"}}>{o?.Description}</td>
                                                    <td style={{width: "15%"}}>{getPersonName(o?.PersonID)}  </td>
                                                    <td style={{width: "15%"}}>{o?.DimensionOfLife?.DimensionOfLife}</td>
                                                    <td style={{width: "15%"}}>{o?.MetricOfSuccess?.MetricOfSuccess}</td>
                                                    <td style={{width: "5%", textAlign: "center"}}>{o?.DIY ? '•' : ''}</td>
                                                    <td style={{width: "5%", textAlign: "center"}}>{o?.AssistanceNeeded ? '•' : ''}</td>
                                                </tr>
                                            )
                                        })}

                                        </tbody>
                                    </table>
                                }
                                {(longTermPriorities?.length ?? 0) > 0 &&
                                    <table className="dream-table no-numbers">
                                        <thead>
                                        <tr>
                                            <th>Long Term</th>
                                            <th>Who</th>
                                            <th>Dimension</th>
                                            <th>Metric</th>
                                            <th>DIY</th>
                                            <th>Assisted</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {longTermPriorities?.map(o => {
                                            return (
                                                <tr>
                                                    <td style={{width: "40%"}}>{o?.Description}</td>
                                                    <td style={{width: "15%"}}>{getPersonName(o?.PersonID)}  </td>
                                                    <td style={{width: "15%"}}>{o?.DimensionOfLife?.DimensionOfLife}</td>
                                                    <td style={{width: "15%"}}>{o?.MetricOfSuccess?.MetricOfSuccess}</td>
                                                    <td style={{width: "5%", textAlign: "center"}}>{o?.DIY ? '•' : ''}</td>
                                                    <td style={{width: "5%", textAlign: "center"}}>{o?.AssistanceNeeded ? '•' : ''}</td>
                                                </tr>
                                            )
                                        })}

                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                        <div className="dlpr-footer">
                            {/* Footer from other lifeprints */}
                            <div style={{display: "flex", flexDirection: "row", border: "thin solid #7acaca", padding: "0px"}}>
                                <div style={{flex: "1"}}>
                                    <div style={{textAlign: "center"}}>
                                        <img className="module-logo" src={DreamLogo}/>
                                    </div>
                                </div>
                                <div style={{flex: "1", alignContent: "flex-start", borderRight: "thin solid #7acaca"}}>
                                    <p className="blue" style={{fontSize: "59px"}}>Dream</p>
                                </div>
                                <div style={{flex: "5", alignContent: "center", borderRight: "thin solid #7acaca"}}>
                                    <p style={{fontSize: "32px", textAlign: "center"}} className="title dark-turquoise">Key Question</p>
                                    <p style={{fontSize: "46px", fontWeight: "600", textAlign: "center"}} className="question blue">Of all your priorities, which one is most meaningful and why?</p>
                                </div>
                                <div style={{flex: "2", display: "flex", flexDirection: "column", borderRight: "thin solid #7acaca"}}>
                                    <div style={{flex: "1", display: "flex", flexDirection: "row", borderBottom: "thin solid #7acaca", backgroundColor: "#eef8f7"}}>
                                        <div style={{flex: "1"}}>
                                            <img style={{maxHeight: "1in", width: "auto"}} src={household ? getFamilyPicture(household) : undefined}/>
                                        </div>
                                        <div style={{flex: "3", alignSelf: "center"}}>
                                            <p style={{fontSize: "24px", fontWeight: "600", textAlign: "left"}} className="blue">{getFamilyName(household, persons)}</p>
                                        </div>
                                        <div style={{flex: "1"}}>
                                            <p>{Date.now}</p>
                                        </div>
                                    </div>
                                    <div style={{flex: "1", display: "flex", flexDirection: "row"}}>
                                            <div className="f-col-left" style={{paddingLeft: "15px"}}>
                                                <p className="blue" style={{ fontSize: "16px", fontWeight: "600"}}>
                                                    {owner}
                                                </p>
                                            </div>
                                        {/* <div className="f-col-right">
                                            <div className="f-col-inline">
                                                <p className="blue">Financial<br/> Advisor </p>
                                            </div>
                                            <div className="f-col-inline">
                                                <img src="images/header-img.jpg"/>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div style={{flex: "1", padding: "5px"}}>
                                    <div style={{textAlign: "center"}}>
                                        <img style={{height: "1in", width: "auto"}} src={logoBase64WithouText}/>
                                        <div style={{textAlign: "center", fontSize: "42px", fontWeight: "600"}} className="blue">Clariata</div>
                                        <div style={{textAlign: "center", fontSize: "32px", fontWeight: "600"}} className="orange">
                                            clariata.com
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* END Footer from other lifeprints */}
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            </PDFReportExport>
        </>
    )
}


export default DreamLifePrint;
