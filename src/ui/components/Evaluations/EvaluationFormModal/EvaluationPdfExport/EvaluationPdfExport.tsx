import { PDFExportProps } from '@progress/kendo-react-pdf';
import { useStoreState } from 'easy-peasy';
import React, { ReactElement } from 'react';

import { ClientEvaluation } from '~/types/api/clientEvaluation';
import Modal from '~/ui/components/Dialogs/Modal';
// import Header from '~/ui/components/Reports/Header/Header';
import PDFReportExport from '~/ui/components/Reports/PDFReportExport';
import { IReportOptions } from '~/ui/components/Reports/PDFReportExport/PDFReportExport';
import ReportWrapper from '~/ui/components/Reports/ReportWrapper/ReportWrapper';
import { getFamilyName } from '~/ui/components/Reports/StoryOfUsReport/StoryOfUs';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
interface IProps {
  isOpen: boolean;
  onClose: any;
  evaluation?: ClientEvaluation;
}

const EvaluationPdfExport = ({ isOpen, onClose, evaluation }: IProps): ReactElement => {
  const { selectedHousehold } = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const handleClose = () => {
    onClose(false);
  };
  const familyName = getFamilyName(selectedHousehold, persons);
  const reportOptions: IReportOptions = {
    title: 'Curation Overview Worksheet',
    familyName: selectedHousehold?.HouseholdName,
    worksheet: true,
    storyofus: true,
    reportLogo: '',

    header: true,
  };

  const options: PDFExportProps = {
    paperSize: 'auto',
    fileName: 'Client Evaluation',
    scale: 1,
    subject: 'Profile: Client Evaluation',
    author: selectedHousehold?.CreatedBy,
    keepTogether: '.keep-together',
  };

  const headerProps = {
    showHeader: true,
    title: 'Client Evaluation',
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(selectedHousehold, persons),
    image: null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined,
  };

  return (
    <Modal title="Export Client Evaluation" isOpen={isOpen} handleClose={handleClose} width="md">
      <div style={{marginLeft: "auto!important", marginRight: "auto !important"}}>
        <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
          <ReportWrapper reportTitle={options.subject} ownerId={Number('5')} householdId={Number('69')}>
            <Header familyName={familyName} />
            <div className="mainContent">
              <div className="contentboxgray">What are you trying to accomplish at this point in your life?</div>
              <div className="contentboxgraytitle">{evaluation?.GoalsDetail}</div>
            </div>
            <div className="mainContent content">
              <div className="contentboxgray">What are your concerns?</div>
              <div className="contentboxgraytitle">{evaluation?.ConcernsDetail}</div>
            </div>
            <div className="mainContent content">
              <div className="contentboxgray">How complex are your family’s affairs?</div>

              <div className="contentboxgraytitle">{evaluation?.NeedsDetail}</div>
              <table>
                <th className={evaluation?.LegacyInterestID === 1 ? 'tabletitle colorclass' : 'tabletitle'}>
                  1 <br /> Easy
                </th>
                <th className={evaluation?.LegacyInterestID === 2 ? 'tabletitle colorclass' : 'tabletitle'}>
                  2 <br /> Somewhat Easy
                </th>
                <th className={evaluation?.LegacyInterestID === 3 ? 'tabletitle colorclass' : 'tabletitle'}>
                  3 <br /> Average
                </th>
                <th className={evaluation?.LegacyInterestID === 4 ? 'tabletitle colorclass' : 'tabletitle'}>
                  4 <br /> Somewhat Difficult
                </th>
                <th className={evaluation?.LegacyInterestID === 5 ? 'tabletitle colorclass' : 'tabletitle'}>
                  5 <br /> Difficult
                </th>
              </table>
            </div>
            <div className="mainContent content">
              <div className="contentboxgray">
                {' '}
                What is your interest in perpetuating a family legacy and what do you want to pass on to your family?
              </div>

              <div className="contentboxgraytitle">{evaluation?.LegacyDetail}</div>
              <table>
                <th className={evaluation?.LegacyInterestID === 1 ? 'tabletitle colorclass' : 'tabletitle'}>
                  5 <br /> Multigenerational
                </th>
                <th className={evaluation?.LegacyInterestID === 2 ? 'tabletitle colorclass' : 'tabletitle'}>
                  4 <br /> Present Generations
                </th>
                <th className={evaluation?.LegacyInterestID === 3 ? 'tabletitle colorclass' : 'tabletitle'}>
                  3 <br /> Traditions & Values Only
                </th>
                <th className={evaluation?.LegacyInterestID === 4 ? 'tabletitle colorclass' : 'tabletitle'}>
                  2 <br /> None
                </th>
              </table>
            </div>
            <Footer />
          </ReportWrapper>
        </PDFReportExport>
      </div>
    </Modal>
  );
};

export default EvaluationPdfExport;
