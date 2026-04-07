import { Button, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import TimelineEditor from './TimelineEditor';
import { useRouter } from 'next/router';
import TimelineReport from './TimelineReport';

const Timeline = () => {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      <Grid item spacing={1} container>
        <Grid item xs={1}>
          <Button color="primary" variant="contained" onClick={() => router.back()}>
            Go Back
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button color="primary" variant="contained" onClick={() => setShowFilter(!showFilter)}>
            {showFilter ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Grid>
      </Grid>
      <Grid item spacing={1} container>
        <Grid item xs={12}>
          <TimelineEditor showFilter={showFilter}/>
        </Grid>
      </Grid>
    </>
  );
};

export default Timeline;
