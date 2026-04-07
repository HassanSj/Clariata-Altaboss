import React, {ReactElement} from 'react';
import {Grid, TextField} from "@material-ui/core";
import useDataPagination from "~/ui/hooks/useDataPagination";
import {useStoreState} from "~/store/hooks";
import IconButton from "@material-ui/core/IconButton";
import {SortDirection} from "~/ui/constants/data";
import Icon from "@material-ui/core/Icon";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import EditSharing from "~/ui/components/Sharing/EditSharing";
import Modal from '../../Dialogs/Modal';
import InterviewStepQuestion from '../../Wizard/Interviews/InterviewStepQuestion';
import { QuestionAndResponse } from '~/types/api/questionAndResponse';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';

interface IProps {
  isOpen: boolean;
  onClose: () => unknown;
}

const ReportsModal = ({ isOpen, onClose }: IProps): ReactElement => {
  const { wizard, activeStep, activeSubStep } = useStoreState((state) => state.wizard);
  const { Document, Page } = require('react-pdf'); 


  const {
    selectedReport,
    selectedReportProps,
    selectedReportParams,
    selectedReportPath,
    showReport,
    viewReport,
    hideReport,
    downloadPdfReport,
    downloadExcelReport,
    downloadPdfReportWithSelection
  } = useReports();


  return (
    <>
      <Modal title="Report" isOpen={isOpen} handleClose={onClose} submitText="Print" handleSubmit={() => downloadPdfReportWithSelection(ReportType.DISCOVER_INTERVIEW)}>
        <div>
          {activeSubStep?.questions ? activeSubStep?.questions?.map((question: QuestionAndResponse, index: number) => {
        return (
          <>
            {/* {(!showStarredQuestionsOnly || (showStarredQuestionsOnly && Boolean(question?.Question?.Starred))) ? */}
              <InterviewStepQuestion key={question?.Question?.QuestionID}
                                     index={index}
                                     wizard={wizard}
                                     step={activeStep}
                                     subStep={activeSubStep}
                                     question={question} 
                                     isForReport={true}/>
            {/* : null} */}
          </>
        )
      }) : null }
        </div>
      </Modal>
    </>
  )
}

export default ReportsModal;
