import React, {ReactElement} from "react";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {getInterviewWizardFull, getResponseAppliesToText} from "~/services/interview";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {Checkbox, FormControlLabel, Grid} from "@material-ui/core";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import {Household} from "~/types/api/household";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {WizardType} from "~/ui/constants/wizard";
import styles from "./InterviewQuestionsReport.module.scss";
import { Person } from "~/types/api/person";
import StarIcon from '@material-ui/icons/Star';
import api from "~/services/api";
import star from "./images/starIcon.png";
import { PrimaryPersonType, ReportType, ReportTypes } from "~/ui/constants/reports";
import { questionWithResponse } from "../../Wizard/Interviews/InterviewStepQuestion/InterviewStepQuestion";
import moment from "moment";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { PageMargin } from "@progress/kendo-drawing/pdf";


/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param showResponses
 * @param hideClarifying
 * @param vmv
 * @param excludedDimensions
 * @param excludedMetrics
 * @param excludedQuestions
 * @param excludedResponses
 */
export const getInterviewQuestionsReportData = async (householdId: number,
                                                interviewId: number,
                                                showResponses?: boolean,
                                                hideClarifying?: boolean,
                                                vmv?: boolean,
                                                excludedDimensions?: number[],
                                                excludedMetrics?: number[],
                                                exclduedQuestions?: number[],
                                                excludedResponses?: number[]) => {
    // Null check
    if (isNullOrUndefined(householdId) || isNullOrUndefined(interviewId)) {
        // TODO - handle no interview id
    }

    // Fetch data
    
    const wizard =  await getInterviewWizardFull(Number(householdId), Number(interviewId));
    const household = await api.household.get(householdId);
    const householdPersons = await api.person.list(Number(householdId));

    return {
        household: household?.data,
        persons : householdPersons?.data,
        wizard,
        showResponses,
        hideClarifying : hideClarifying,
        vmv : vmv,
        excludedDimensions : excludedDimensions,
        excludedMetrics : excludedMetrics,
        exclduedQuestions : exclduedQuestions,
        excludedResponses : excludedResponses
    };
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param showResponses
 * @param hideClarifying
 * @param vmv
 * @param answeredOnly
 * @param unansweredOnly
 * @param starredOnly
 * @param hiddenOnly
 * @param selectedSections
 */
 export const getFilteredInterviewQuestionsReportData = async (householdId: number,
                                                                interviewId: number,
                                                                showResponses?: boolean,
                                                                hideClarifying?: boolean,
                                                                vmv?: boolean,
                                                                answeredOnly?: boolean,
                                                                unansweredOnly?: boolean,
                                                                starredOnly?: boolean,
                                                                hiddenOnly?: boolean,
                                                                selectedSections?: number[],
                                                                storyReportType?: ReportType) => {
    // Null check
    if (isNullOrUndefined(householdId) || isNullOrUndefined(interviewId)) {
    // TODO - handle no interview id
    }

    // Fetch data

    const wizard =  await getInterviewWizardFull(Number(householdId), Number(interviewId));
    const household = await api.household.get(householdId);
    const householdPersons = await api.person.list(Number(householdId));

    return {
        household: household?.data,
        persons : householdPersons?.data,
        wizard,
        showResponses,
        hideClarifying : hideClarifying,
        vmv : vmv,
        answeredOnly : answeredOnly ? answeredOnly : false,
        unansweredOnly : unansweredOnly ? unansweredOnly : false,
        starredOnly : starredOnly ? starredOnly : false,
        hiddenOnly : hiddenOnly ? hiddenOnly : false,
        selectedSections : selectedSections,
        storyReportType : storyReportType ? storyReportType : "",
    };
}

// export const checkPersonalStory = (storyReportType?: question: QuestionAndResponse, answeredOnly?: boolean, starredOnly?: boolean, hiddenOnly?: boolean) => {
//     let valid = false;
//     if
// }

interface IStepQuestionsProps {
    step: WizardStep;
    household?: Household;
    persons?: Person[];
    stepKey: string;
    interviewType: WizardType;
    showResponses?: boolean;
    hideClarifying?: boolean;
    vmv?: boolean;
    answeredOnly?: boolean;
    unansweredOnly?: boolean;
    starredOnly?: boolean;
    hiddenOnly?: boolean;
    storyReportType?: ReportType | string;
}

const StepQuestions = ({ step, stepKey, household, persons, interviewType, showResponses, hideClarifying, vmv, answeredOnly, unansweredOnly, hiddenOnly, starredOnly, storyReportType}: IStepQuestionsProps) => {

    const doRender = (question: QuestionAndResponse) => {

        let personResponses = question?.Responses;
        if (personResponses && storyReportType && ReportTypes[storyReportType].person) personResponses?.filter(r => r?.AppliesTo == 0 || (ReportTypes[storyReportType].person === PrimaryPersonType.Primary1 ? r?.AppliesTo == household?.PrimaryPerson1ID : (ReportTypes[storyReportType].person === PrimaryPersonType.Primary2 ? r?.AppliesTo == household?.PrimaryPerson2ID : true)));

        if((answeredOnly && personResponses && personResponses?.length > 0) ||
            (unansweredOnly && (!personResponses || personResponses?.filter(r => r?.ResponseText != "")?.length == 0)) ||
            (starredOnly && personResponses && personResponses.some(r => r?.Starred)) ||
            (hiddenOnly && personResponses && personResponses.some(r => r?.Hidden)) ||
            (!answeredOnly && !unansweredOnly && !starredOnly && !hiddenOnly) && 
            ((storyReportType && String(storyReportType) != "" && ReportTypes[storyReportType].questionIds && ReportTypes[storyReportType].questionIds!?.indexOf(question?.Question?.QuestionID!) >= 0) || !storyReportType || String(storyReportType) == "")) return true;
        return false;
    }

    return (
        <>
          {step?.questions ? step?.questions.map((question, questionIndex) => {
                const questionKey = `${stepKey}-${questionIndex}`;
                if((vmv && step?.discoveryCategory?.DimensionOfLifeID == 15) || !vmv) {
                    if(doRender(question))
                    return (
                            <>
                                <tr>
                                    <td className="table-question-text">
                                        {question.Question.QuestionText}
                                    </td>
                                </tr>

                                {showResponses ? 
                                    <QuestionResponses interviewType={interviewType}
                                                        question={question}
                                                        questionKey={questionKey}
                                                        household={household}
                                                        persons={persons}
                                                        starredOnly={starredOnly}
                                                        hiddenOnly={hiddenOnly}
                                                        storyReportType={storyReportType}/> : null }
                                {hideClarifying ? null : 
                                <>
                                    {question?.SubQuestions ? question.SubQuestions.map((subQuestion, subQuestionIndex) => {
                                            const subQuestionKey = `${questionKey}-${subQuestionIndex}`;
                                            // if ((answeredOnly && subQuestion?.Responses && subQuestion?.Responses?.length > 0) || (unansweredOnly && subQuestion?.Responses?.length === 0) || (starredOnly && subQuestion?.Responses && subQuestion?.Responses?.length > 0 && subQuestion?.Responses?.some(r => r?.Starred)) || (hiddenOnly && subQuestion?.Responses && subQuestion?.Responses?.length > 0 && subQuestion?.Responses?.some(r => r?.Hidden)) || (!answeredOnly && !unansweredOnly && !starredOnly && !hiddenOnly))
                                            if(doRender(subQuestion)) {
                                            return (
                                                <>
                                                {/* {(storyReportType && String(storyReportType) != "" && ReportTypes[storyReportType].questionIds && ReportTypes[storyReportType].questionIds!?.indexOf(subQuestion?.Question?.QuestionID!) >= 0) || !storyReportType || String(storyReportType) == "" ? */}
                                                {/* <> */}
                                                    <tr>
                                                    <td className="clarifying">
                                                        {subQuestion?.Question?.QuestionText}
                                                    </td>
                                                    </tr>
                                                        {showResponses ?
                                                        <QuestionResponses interviewType={interviewType}
                                                                            question={subQuestion}
                                                                            questionKey={subQuestionKey}
                                                                            household={household}
                                                                            persons={persons}
                                                                            clarifying={hideClarifying}
                                                                            starredOnly={starredOnly}
                                                                            hiddenOnly={hiddenOnly}
                                                                            storyReportType={storyReportType}/> : null }
                                                {/* </>  : null } */}
                                                </>
                                            )}
                                    }) : null }
                                </>}
                            </>
                        
                    )}
              }
          ) : null}
      </>
    )
}

interface IQuestionResponsesProps {
    question: QuestionAndResponse;
    household?: Household;
    persons?: Person[];
    questionKey: string;
    interviewType: WizardType;
    clarifying?: boolean;
    starredOnly?: boolean;
    hiddenOnly?: boolean;
    storyReportType?: ReportType | string;
}

const QuestionResponses = ({ question, questionKey, household, persons, interviewType, clarifying, starredOnly, hiddenOnly, storyReportType }: IQuestionResponsesProps) => {
    
    const personResponses = (storyReportType && ReportTypes[storyReportType].person) ? question?.Responses?.filter(r => r?.AppliesTo === 0 || (ReportTypes[storyReportType].person === PrimaryPersonType.Primary1 ? r?.AppliesTo == household?.PrimaryPerson1ID : (ReportTypes[storyReportType].person === PrimaryPersonType.Primary2 ? r?.AppliesTo == household?.PrimaryPerson2ID : false))) : question?.Responses;

    return (
      <>
          {personResponses ? personResponses.sort((a, b) => {
                return moment(a?.CreationDate!)?.toDate().getTime() - moment(b?.CreationDate!).toDate().getTime()}).map((response, responseIndex) => {
              const responseKey = `${questionKey}-${responseIndex}`;
              if((starredOnly && response.Starred) || (hiddenOnly && response.Hidden) || (!starredOnly && !hiddenOnly && !response.Hidden))
              {
                return (
                    <tr>
                    <td key={responseKey} className={clarifying ? "clarifying response" : "response"}>
                            CLIENT: <span className="light">{ getResponseAppliesToText(response, persons) } {response?.Starred ?
                                    <span className={styles.star_filled}>
                                        {/* <StarIcon/> */}
                                        <img src={star} height="20" width="20" />
                                    </span>
                                : null}</span> <br />
                            RESPONSE: <span className="light">{ !isNullOrUndefined(response.ResponseText) ? response.ResponseText : 'N/A' }</span>
                    </td>
                    </tr> 
                )
                
              }
          }) : null}
      </>
    )
}

export const InterviewQuestionsReportContent = ({ wizard, showResponses, hideClarifying, vmv, household, persons, selectedSections, answeredOnly, unansweredOnly, hiddenOnly, starredOnly, storyReportType }: IInterviewQuestionsReportProps): ReactElement => {
    const isDreamReport = (wizard?.type === WizardType.DREAM_INTERVIEW);

    const doRender = (subStep: WizardStep) => {

        // const personResponses = (storyReportType && ReportTypes[storyReportType].person) ? subStep?.questions?.filter(q => q?.Responses?.some(r => r?.AppliesTo === 0 || (ReportTypes[storyReportType].person === PrimaryPersonType.Primary1 ? r?.AppliesTo == household?.PrimaryPerson1ID : (ReportTypes[storyReportType].person === PrimaryPersonType.Primary2 ? r?.AppliesTo == household?.PrimaryPerson2ID : true)))) : subStep?.questions;
        let personResponses = subStep?.questions;
        if (personResponses && storyReportType && ReportTypes[storyReportType].person) personResponses?.forEach((q,i) => personResponses![i].Responses = q?.Responses?.filter(r => r?.AppliesTo == 0 || (ReportTypes[storyReportType].person === PrimaryPersonType.Primary1 ? r?.AppliesTo == household?.PrimaryPerson1ID : (ReportTypes[storyReportType].person === PrimaryPersonType.Primary2 ? r?.AppliesTo == household?.PrimaryPerson2ID : false))));
        if(isDreamReport) {
            if(!selectedSections || selectedSections.length === 0 || selectedSections?.indexOf(isDreamReport ? (4 * subStep?.dimensionOfLife?.DimensionOfLifeID! + subStep?.metricOfSuccess?.MetricOfSuccessID!) : subStep?.discoveryCategory?.DimensionOfLifeID!) > -1) return true;
        }
        else if((!selectedSections || selectedSections.length === 0 || selectedSections?.indexOf(isDreamReport ? (4 * subStep?.dimensionOfLife?.DimensionOfLifeID! + subStep?.metricOfSuccess?.MetricOfSuccessID!) : subStep?.discoveryCategory?.DimensionOfLifeID!) > -1) &&
                (!storyReportType || (personResponses?.some(q => ReportTypes[storyReportType!].questionIds!?.indexOf(q?.Question?.QuestionID!) >= 0))) && 
                ((answeredOnly && (personResponses?.some(q => (q?.Responses && q?.Responses?.length > 0 )))) || !answeredOnly) && 
                ((unansweredOnly && (personResponses?.some(q => q?.Responses?.filter(r => r?.ResponseText != "")?.length == 0))) || !unansweredOnly) &&
                ((starredOnly && (personResponses?.some(q => (q?.Responses?.some(r => r?.Starred))))) || !starredOnly) &&
                ((hiddenOnly && (personResponses?.some(q => (q?.Responses?.some(r => r?.Hidden))))) || !hiddenOnly)) return true;
        return false;
    }

    return (
        <div className="ppw-top">
            {wizard?.steps.map((step, stepIndex) => (
                <div className="interview-table" key={stepIndex}>
                    {step?.steps ? step?.steps.map((subStep, subStepIndex) => {
                        const subStepKey = `${stepIndex}-${subStepIndex}`;
                        if((vmv && subStep?.discoveryCategory?.DimensionOfLifeID == 15) || !vmv) {
                            // if ((isExcluded(subStep?.dimensionOfLife?.DimensionOfLifeID, isDreamReport ? subStep?.metricOfSuccess?.MetricOfSuccessID : undefined) && isEditor) || !isExcluded(subStep?.dimensionOfLife?.DimensionOfLifeID, isDreamReport ? subStep?.metricOfSuccess?.MetricOfSuccessID : undefined)) {
                                return (
                                    <>
                                    {/* {(isExcluded(subStep?.dimensionOfLife?.DimensionOfLifeID, isDreamReport ? subStep?.metricOfSuccess?.MetricOfSuccessID : undefined) && isEditor) || !isExcluded(subStep?.dimensionOfLife?.DimensionOfLifeID, isDreamReport ? subStep?.metricOfSuccess?.MetricOfSuccessID : undefined) ?  */}
                                    {doRender(subStep) ?
                                    <>
                                    {/* <ReportWrapper reportTitle={"Response Report"} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} isWide={true} > */}
                                    <table className="table-questions-wrap" key={subStepKey}>
                                        <thead className="int-table-header">
                                        <tr>
                                            <th>
                                                {isDreamReport ? step?.title : null} {subStep.title}
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/* {showQuestions || !isEditor ? */}
                                        <StepQuestions interviewType={wizard?.type}
                                                    step={subStep}
                                                    stepKey={subStepKey}
                                                    household={household}
                                                    persons={persons}
                                                    showResponses={showResponses} 
                                                    hideClarifying={hideClarifying}
                                                    vmv={vmv}
                                                    answeredOnly={answeredOnly}
                                                    unansweredOnly={unansweredOnly}
                                                    starredOnly={starredOnly}
                                                    hiddenOnly={hiddenOnly}
                                                    storyReportType={storyReportType}/>
                                        </tbody>
                                    </table>
                                    {/* </ReportWrapper> */}
                                    {/* <div className="newPage"></div> */}
                                    </>
                                     : null}
                                    </>
                                )
                            // }
                        }
                    }) : null}
                </div>
            ))}
        </div>
    )
}

export interface IInterviewQuestionsReportProps {
    wizard?: WizardState | undefined;
    showResponses?: boolean;
    hideClarifying?: boolean;
    vmv?: boolean;
    household?: Household;
    persons?: Person[];
    isOpen?: boolean;
    onClose?: () => unknown;
    isModal?: boolean;
    selectedSections?: number[];
    answeredOnly?: boolean;
    unansweredOnly?: boolean;
    starredOnly?: boolean;
    hiddenOnly?: boolean;
    storyReportType?: ReportType | string;
}

const InterviewQuestionsReport = ({ wizard, showResponses, hideClarifying, vmv, household, persons, isOpen, onClose, isModal, answeredOnly, unansweredOnly, starredOnly, hiddenOnly, selectedSections, storyReportType }: IInterviewQuestionsReportProps): ReactElement => {
    const isDreamReport = (wizard?.type === WizardType.DREAM_INTERVIEW);
    const [showRes,setShowRes] = React.useState<boolean>(showResponses ? showResponses : false);
    const [hideCla,setHideCla] = React.useState<boolean>(hideClarifying ? hideClarifying : false);

    const getSubTitle = () => {
        if(unansweredOnly || answeredOnly || hiddenOnly || starredOnly || (selectedSections && selectedSections.length > 0) || storyReportType) {
            const from = selectedSections && selectedSections?.length > 0 ? " from selected grids" : storyReportType ? ` from ${ReportTypes[storyReportType].name} Report` : "";
            const type = `${unansweredOnly ? 'Unanswered Questions' : answeredOnly ? 'Answered Questions' : starredOnly ? 'Starred Responses' : hiddenOnly ? 'Hidden Responses' : 'All Responses'}`;
            return type + from;
        }
        return "";
    }

    const reportOptions: IReportOptions = {
        title: `${isDreamReport ? 'Dream' : 'Discover'} Interview`,
        subTitle: getSubTitle(),
        storyofus: true,
        headerNoRight: true,
        isOpen,
        onClose,
        header: true,
    }

    const margins : PageMargin = {
        left: "30pt",
        right: "30pt",
        top: "0pt",
        bottom: "20pt",
    }

    const options: PDFExportProps = {
        paperSize: ["8.5in", "11in"],
        fileName: `${isDreamReport ? 'Dream' : 'Discover'}-Interview`,
        scale: 1,
        subject: `${isDreamReport ? 'Dream' : 'Discover'} Interview`,
        author: household?.CreatedBy,
        keepTogether: ".keep-together"
      }

    return (
        <>
            <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={false} margins={margins}>
                <InterviewQuestionsReportContent  wizard={wizard} showResponses={showRes} hideClarifying={hideCla} vmv={vmv} household={household} persons={persons} isOpen={isOpen} onClose={onClose} isModal={isModal} answeredOnly={answeredOnly} unansweredOnly={unansweredOnly} starredOnly={starredOnly} hiddenOnly={hiddenOnly} selectedSections={selectedSections} storyReportType={storyReportType}/>
            </PDFReportExport>
        </>
    )
}

export default InterviewQuestionsReport;
