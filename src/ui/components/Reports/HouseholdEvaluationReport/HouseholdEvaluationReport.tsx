import React, {ReactElement} from "react";
import {Grid} from "@material-ui/core";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { ClientEvaluation } from "~/types/api/clientEvaluation";
import api from "~/services/api";
import { isNullOrUndefined } from "util";

/**
 * Fetch report data.
 * @param evaluationId
 */
export const getEvaluationReportData = async (evaluationId: number) => {
  // Null check
  if (isNullOrUndefined(evaluationId)) {
  // TODO - handle no evaluation id
  }

  // Fetch data
  const legacyInterest = await api.legacyinterest.list();
  const complexityOfNeeds = await api.complexityofneeds.list();
  const evaluation = await api.evaluation.get(evaluationId);

  return {
    legacyInterest: legacyInterest?.data,
    complexityOfNeeds: complexityOfNeeds?.data,
    evaluation: evaluation?.data
  };
}

export interface HouseholdEvaluationProps {
  evaluation?: ClientEvaluation;
  complexityOfNeeds?: any;
  legacyInterest?: any;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const HouseholdEvaluationReport = ({ evaluation, complexityOfNeeds, legacyInterest, isOpen, onClose }: HouseholdEvaluationProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'Client Evaluation',
    familyName: evaluation?.Description,
    evaluation: true,
    isOpen,
    onClose
  }

  return (
    <>
      <PDFEmbedded options={options}>
          <div className="ppw-top">
            <div className="bc-row">
                <div className="bcr-top">
                    <p>What are you trying to accomplish at this point in your life?</p>
                </div>
                <div className="bcr-center">
                    <p>{evaluation?.GoalsDetail}</p>
                </div>
            </div>
            <div className="bc-row">
                <div className="bcr-top">
                    <p>What are your concerns?</p>
                </div>
                <div className="bcr-center">
                    <p>{evaluation?.ConcernsDetail}</p>
                </div>
            </div>
            <div className="bc-row">
                <div className="bcr-top">
                    <p>How complex are your family’s affairs?</p>
                </div>
                <div className="bcr-center">
                    <p>{evaluation?.NeedsDetail}</p>
                </div>
                <div className="bcr-bottom">
                  {complexityOfNeeds.map((complexity: any, index: number) => (
                  <>
                    <div className={complexity?.ComplexityOfNeedsID == evaluation?.ComplexityOfNeedsID ? "bcrb-item active" : "bcrb-item"}>
                        <p><strong>{complexity?.ComplexityOfNeedsID}</strong><span>{complexity?.ComplexityOfNeedsValue}</span></p>
                    </div>
                  </>
                  ))}
                </div>
            </div>
            <div className="bc-row">
                <div className="bcr-top">
                    <p>What is your interest in perpetuating a family legacy and what do you want to pass on to your family?</p>
                </div>
                <div className="bcr-center">
                    <p>{evaluation?.LegacyDetail}</p>
                </div>
                <div className="bcr-bottom">
                  {legacyInterest.map((legacy: any, index: number) => (
                  <>
                    <div className={legacy?.LegacyInterestID == evaluation?.LegacyInterestID ? "bcrb-item active" : "bcrb-item"}>
                        <p><strong>{legacy?.LegacyInterestID}</strong><span>{legacy?.LegacyInterestValue}</span></p>
                    </div>
                  </>
                  ))}
                </div>
            </div>
          </div>
          <div className="ppw-center">
              <div className="ppw-left">
                  <p>MLP candidate if score is 7 or higher. Traditional financial planning candidate if score is less than 7.</p>
              </div>
              <div className="ppw-right">
                  <div className="ppwr-top">
                      <p>Composite Score:</p>
                  </div>
                  <div className="ppwr-bottom">
                      <p>{Number(evaluation?.ComplexityOfNeedsID) + Number(evaluation?.LegacyInterestID)}</p>
                  </div>
              </div>
          </div>
        
      </PDFEmbedded>
    </>
  )
}


export default HouseholdEvaluationReport;
