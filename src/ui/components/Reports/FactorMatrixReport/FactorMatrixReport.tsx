import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {WizardState} from "~/types/wizard/wizard";
import api from "~/services/api";
import {findPersonRoleName, getAllWizardQuestions, getInterviewWizardFull} from "~/services/interview";
import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {InterviewResponse} from "~/types/api/interviewResponse";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import {Household} from "~/types/api/household";
import {Person} from "~/types/api/person";

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param showResponses
 */
export const getFactorMatrixReportData = async (householdId: number,
                                          interviewId: number) => {
    // Null check
    if (isNullOrUndefined(householdId) || isNullOrUndefined(interviewId)) {
        // TODO - handle no interview id
    }

    // Fetch data
    const metricofsuccessRes = await api.metricofsuccess.list();
    const dimensionofsuccessRes = await api.dimensionofsuccess.list();
    const wizard = await getInterviewWizardFull(Number(householdId), Number(interviewId));

    return {
        wizard,
        questions: wizard ? getAllWizardQuestions(wizard) : undefined,
        metricsOfSuccess: metricofsuccessRes?.data,
        dimensionsOfLife: dimensionofsuccessRes?.data
    };
}

interface IMatrixCellProps {
    question: QuestionAndResponse;
    metricOfSuccess: MetricOfSuccess;
    dimensionOfLife: DimensionOfLife;
    row: number;
    col: number;
    persons?: Person[];
}

const MatrixCell = ({ question, persons }: IMatrixCellProps)=> {
    const responseCount = question?.Responses ? question?.Responses?.length : 0;

    return (
        <div>
            {question?.Responses?.map((response: InterviewResponse, responseIndex: number) => {
                return (
                  <>
                      <MatrixCellResponse key={response.InterviewResponseID}
                                          response={response}
                                          persons={persons} />
                      { (responseIndex < (responseCount - 1)) ?
                        <br />
                      : null }
                  </>
                )
            })}
        </div>
    )
}

interface IMatrixCellResponseProps {
    response: InterviewResponse;
    persons?: Person[];
}

const MatrixCellResponse = ({ response, persons }: IMatrixCellResponseProps)=> {
    const [person, setPerson] = useState<any>(findPersonRoleName(response,persons));

    return (
      <div>
          <b>{ person }</b>: <br />
          { response.ResponseText }
      </div>
    )
}

export interface IFactorMatrixReportProps {
    wizard?: WizardState | undefined;
    questions?: QuestionAndResponse[];
    dimensionsOfLife?: DimensionOfLife[];
    metricsOfSuccess?: MetricOfSuccess[];
    household?: Household;
    isOpen?: boolean;
    onClose?: () => unknown;
}

const FactorMatrixReport = ({ wizard, questions, dimensionsOfLife, metricsOfSuccess, household, isOpen, onClose }: IFactorMatrixReportProps) => {

    const options: IPDFReportOptions = {
        title: 'Factor Matrix Report',
        isOpen,
        onClose
    }

    const getCellQuestions = (metricOfSuccess: number, dimensionOfLife: number, appliesTo?: number) => {
        return Boolean(questions) ? questions?.filter((q: QuestionAndResponse) => {
            return (q.Question.MetricOfSuccessID === metricOfSuccess)
                && (q.Question.DimensionOfLifeID === dimensionOfLife);
        }) : [];
    }

    const isEven = (num: number) => {
        return (num % 2 === 0);
    }

    return (
        <>
            <PDFEmbedded options={options}>
                {/* HEADER ROW */}
                <Grid container spacing={3}>
                    <Grid item xs={3}></Grid>
                    {dimensionsOfLife?.map((dimensionOfLife: DimensionOfLife, colIndex: number) => (
                      <Grid item xs={3} key={`${colIndex}_${colIndex}`}>
                          <span className="report_matrix_header">{dimensionOfLife?.DimensionOfLife}</span>
                      </Grid>
                    ))}
                </Grid>
                {/* CONTENT ROWS */}
                {metricsOfSuccess?.map((metricOfSuccess: MetricOfSuccess, rowIndex: number) => (
                  <Grid container spacing={3} key={rowIndex} className={isEven(rowIndex) ? "report_matrix_row_alt" : "report_matrix_row"}>
                      {dimensionsOfLife?.map((dimensionOfLife: DimensionOfLife, colIndex: number) => (
                        <Grid item xs={3} key={`${colIndex}-${rowIndex}`}>
                            { (colIndex === 0) ? <span className="report_matrix_header">{metricOfSuccess?.MetricOfSuccess}</span> :
                              <>
                                  {getCellQuestions(metricOfSuccess.MetricOfSuccessID, dimensionOfLife.DimensionOfLifeID)
                                    ?.map((question: QuestionAndResponse, questionIndex: number) => (
                                      <MatrixCell dimensionOfLife={dimensionOfLife}
                                                  metricOfSuccess={metricOfSuccess}
                                                  row={rowIndex}
                                                  col={colIndex}
                                                  question={question}
                                                  key={questionIndex}
                                                  persons={household?.Persons} />
                                    ))}
                              </>
                            }
                        </Grid>
                      ))}
                  </Grid>
                ))}
            </PDFEmbedded>
        </>
    )
}

export default FactorMatrixReport;
