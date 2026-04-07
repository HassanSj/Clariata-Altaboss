import React from 'react';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { Grid } from '@material-ui/core';
import { NavigationTab } from '~/ui/constants/navigations';
import ActionStepReport from '~/ui/components/Reports/ActionStepReport/ActionStepReport';
import { useStoreState } from 'easy-peasy';

const ActionStepReports = () => {
  const { selectedHousehold } = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const { dreamInterviewId } = useStoreState(state => state.selected);

  return (
    <>
      <DashboardWrapper tab={NavigationTab.REPORTS}>
        <Grid container spacing={1}>
          <Grid xs={3}></Grid>
          <Grid item xs={6}>
            <ActionStepReport household={selectedHousehold} persons={persons} dreamInterviewId={dreamInterviewId} />
          </Grid>
        </Grid>
      </DashboardWrapper>
    </>
  );
};

export default ActionStepReports;
