import React from "react";
import styles from "./InterviewAdditionalPriority.module.scss";
import classnames from "classnames";
import {useStoreState} from "~/store/hooks";
import Typography from "@material-ui/core/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Grid,
  Icon
} from "@material-ui/core";
import { Objective } from "~/types/api/objective";
import InterviewAdditionalPriorityContent from "../InterviewAdditionalPriorityContent";

interface IProps {
  priorities: Objective[];
  metricOfSuccessID: Number;
  dimensionOfLifeID: Number;
}

const InterviewAdditionalPriority = ({priorities, metricOfSuccessID, dimensionOfLifeID}: IProps) => {

  const { selectedInterview } = useStoreState((state) => state.interview);

  const [expanded, setExpanded] = React.useState(false);

  // Handle expand event
  const onExpand = async () => {
    setExpanded(!expanded);
  }

  return (
    <>
      <Accordion className={styles.question_container}
                 defaultExpanded={false}
                 expanded={expanded}>
        <AccordionSummary
          onClick={()=> {
              onExpand();
          }}
          className={classnames(styles.question_header, styles.parent_question_header)}
          expandIcon={
            <>
              <Icon>expand_more</Icon>
            </>
          }
          aria-controls="panel1a-content"
          id="panel1a-header">
          <div className={styles.header_question}>
            <Typography className={styles.question_text}>Additional Priorities</Typography>
          </div>
          <div className={styles.header_action}>
            {(priorities.length > 0) ?
              <Chip className={styles.header_action_chip} label={`${priorities.length} ${priorities.length === 1 ? 'priority' : 'priorities'}`}
                    color="default"/>
              :
              <Chip className={styles.header_action_chip} label={`${priorities.length} ${priorities.length === 1 ? 'priority' : 'priorities'}`}
                    color="secondary"/>
            }
          </div>
        </AccordionSummary>
        <AccordionDetails className={styles.responses_details}>
          <div className={styles.responses_wrapper}>
            <div className={styles.responses_container}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <div className={styles.text_header}>Client</div>
                </Grid>
                <Grid item xs={4}>
                  <div className={styles.text_header}>Priority</div>
                </Grid>
                <Grid item xs={4}>
                  <div className={styles.text_header}>Why Is It Important</div>
                </Grid>
                <Grid item xs={2}>
                  <div className={styles.text_header}>Actions</div>
                </Grid>
              </Grid>
              {priorities.map((priority) => {
                return (
                  <InterviewAdditionalPriorityContent priority={priority} metricOfSuccessID={metricOfSuccessID} dimensionOfLifeID={dimensionOfLifeID}/>
                )
              })}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      
    </>
  );
}

export default InterviewAdditionalPriority;
