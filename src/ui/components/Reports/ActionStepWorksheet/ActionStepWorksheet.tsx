import React, { ReactElement, useState } from 'react';
import { Person } from '~/types/api/person';
import PDFReportExport, { IReportOptions } from '~/ui/components/Reports/PDFReportExport/PDFReportExport';
import { PDFExportProps } from '@progress/kendo-react-pdf';
import { getFamilyName, getCouplePicture } from '../StoryOfUsReport/StoryOfUsReport';
import { Household } from '~/types/api/household';
import api from '~/services/api';
import { Objective } from '~/types/api/models';
import moment from 'moment';
import Header, { HeaderProps } from '~/ui/components/Reports/Header/Header';
import ReportWrapper from '../ReportWrapper/ReportWrapper';
import { Button, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import useMountEvents from '~/ui/hooks/useMountEvents';
import EmptyContainer from '../../Containers/EmptyContainer';
import router from 'next/router';
import Loader from '../../Loader';

export interface ActionStepWorksheetProps {
  household?: Household;
  persons?: Person[];
  dreamInterviewId?: any;
}

const reportLogo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC';

const ActionStepWorksheet = ({ household, persons, dreamInterviewId }: ActionStepWorksheetProps): ReactElement => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [objectiveDetail, setObjectiveDetail] = useState<Objective>();
  const [loading, setLoading] = useState<boolean>(false);

  const reportOptions: IReportOptions = {
    title: 'Action Steps Worksheet',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    header: true,
  };

  const options: PDFExportProps = {
    paperSize: 'auto',
    fileName: 'Action Steps Worksheet',
    scale: 1,
    subject: 'Direction: Action Steps Worksheet',
    author: household?.CreatedBy,
    keepTogether: '.keep-together',
    landscape: false,
  };

  const headerProps = {
    showHeader: true,
    title: 'Action Steps Worksheet',
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: reportLogo,
  };

  const handleObjectiveListChange = (e: any) => {
    const objectiveID = e?.target?.value;
    const selectedObjective = objectives?.find(obj => obj?.ObjectiveID == objectiveID);
    setObjectiveDetail(selectedObjective);
  };

  useMountEvents({
    onMounted: async () => {
      if (household?.HouseholdID) {
        setLoading(true);
        const res = await api.objective.list(household.HouseholdID, dreamInterviewId);
        const sorted = res?.data.sort(x => Number(x.Rank))
        if(sorted) {
          setObjectives(sorted);
          setObjectiveDetail(sorted[0]);
        }
        setLoading(false);
      }
    },
  });

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
      <div
        style={{
          marginTop: '25px',
          marginLeft: '170px',
          marginRight: 'auto',
          marginBottom: '20px',
          width: '600px',
        }}
      >
        <InputLabel id="demo-simple-select-label" style={{ marginLeft: '5px' }}>
          Please Select a Priority
        </InputLabel>
        <Select
          native={false}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          fullWidth={true}
          style={{ height: '40px', borderRadius: '5px', backgroundColor: 'white' }}
          onChange={handleObjectiveListChange}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          value={objectiveDetail?.ObjectiveID}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected: any) => {
            return objectiveDetail?.Description;
          }}
        >
          {objectives.map((item: Objective, i) => {
            return (
              <MenuItem key={i} value={item?.ObjectiveID} selected={item?.ObjectiveID == objectiveDetail?.ObjectiveID ? true : false}>
                <ListItemText primary={item?.Description} />
              </MenuItem>
            );
          })}
        </Select>
      </div>
      {objectiveDetail ? (
        <PDFReportExport options={options} reportOptions={reportOptions}>
          <>
            <ReportWrapper
              reportTitle={options.subject}
              ownerId={Number(household?.CreatedBy)}
              householdId={Number(household?.HouseholdID)}
            >
              <Header
                showHeader={headerProps.showHeader}
                title={headerProps.title}
                subTitle={headerProps.subTitle}
                image={headerProps.image}
                familyName={headerProps.familyName}
                headerNoRight={headerProps.headerNoRight}
                reportLogo={headerProps.reportLogo}
                worksheet={headerProps.worksheet}
                storyofus={headerProps.storyofus}
              />
              <div className="action-ppw-top">
                <div className="action-worksheet-body-copy">
                  <table className="actionsheet-table keep-together" cellPadding="0" cellSpacing="0">
                    <thead>
                      <th
                        style={{
                          borderTop: '0.5px solid white !important',
                          borderLeft: '0.5px solid white !important',
                        }}
                      ></th>
                      <th
                        style={{
                          whiteSpace: 'break-spaces',
                          fontSize: '10px',
                          maxWidth: '160px',
                          minWidth: '160px',
                          color: '#173d68',
                        }}
                      >
                        Priority: {objectiveDetail?.Description}
                      </th>
                      <th style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#173d68' }}>Champion:</th>
                      <th style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#173d68' }}>
                        {persons?.find((per: Person) => per.PersonID === objectiveDetail?.Champion)?.FirstName}
                      </th>
                      <th
                        style={{
                          fontSize: '8px',
                          whiteSpace: 'nowrap',
                          borderLeft: 'solid 1px #173d68',
                          color: '#173d68',
                          paddingTop: '-30px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>Start Date</span>
                          <span>End Date</span>
                        </div>
                      </th>
                      <th
                        style={{
                          fontSize: '8px',
                          whiteSpace: 'nowrap',
                          color: '#173d68',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>
                            {objectiveDetail?.StartDate
                              ? moment(objectiveDetail?.StartDate).format('DD/MM/YYYY')
                              : null}
                          </span>
                          <span>
                            {objectiveDetail?.ProjectedEndDate
                              ? moment(objectiveDetail?.ProjectedEndDate).format('DD/MM/YYYY')
                              : null}
                          </span>
                        </div>
                      </th>
                      <th
                        style={{
                          fontSize: '8px',
                          whiteSpace: 'nowrap',
                          color: '#173d68',
                          paddingTop: '-30px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #173d68' }}>
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <input
                              type={'checkbox'}
                              checked={objectiveDetail?.DIY === true ? true : false}
                              disabled
                            ></input>
                            <label>DIY</label>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <input
                              type={'checkbox'}
                              checked={objectiveDetail?.AssistanceNeeded === true ? true : false}
                              disabled
                            ></input>
                            <label>Assisted</label>
                          </div>
                        </div>
                      </th>
                    </thead>
                    <tbody>
                      <tr className="action-header">
                        <td className="empty-cell"></td>
                        <td>ActionSteps</td>
                        <td>Start Month</td>
                        <td>Start Year</td>
                        <td>Assisted</td>
                        <td>DIY</td>
                        <td>status</td>
                      </tr>
                      {[...Array(20)].map((item: any, i) => {
                        return (
                          <tr className="empty-rows">
                            <td>{i + 1}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWrapper>
          </>
        </PDFReportExport>
      ) : (
        <EmptyContainer text="No Priorities Selected"></EmptyContainer>
      )}
    </>
    :
    <Loader/>
    }
    </>
  );
};

export default ActionStepWorksheet;
