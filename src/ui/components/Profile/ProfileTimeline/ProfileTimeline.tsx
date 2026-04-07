import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Typography from '@material-ui/core/Typography';
import styles from './ProfileTimeline.module.scss';
import {Icon} from "@material-ui/core";

const ProfileTimeline = () => {

  return (
    <>
      <Timeline align="left">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <Icon>done</Icon>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>Story of us</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="secondary">
              <Icon>query_builder</Icon>
            </TimelineDot>
            <TimelineConnector className={styles.secondaryTail} />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>Vision, mission, values</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  );
};

export default ProfileTimeline;
