import React from "react";
import {Avatar, Button, CardActions, Grid} from "@material-ui/core";
import styles from "./InterviewItem.module.scss";
import {useRouter} from "next/router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import BarProgressIndicator from "~/ui/components/Indicators/BarProgressIndicator";
import Icon from "@material-ui/core/Icon";
import {toPercentage} from "~/ui/constants/utils";
import {InterviewFull} from "~/types/api/interviewFull";
import paths from "~/ui/constants/paths";

const { INTERVIEW } = paths;

interface IProps {
  interview: InterviewFull
}

const InterviewItem = ({ interview }: IProps) => {
  const router = useRouter();
  const progress = toPercentage(interview?.Progress?.TotalInterviewQuestionsAnswered, interview?.Progress?.TotalInterviewQuestionCount);

  const select = () => {
    router.push(`${INTERVIEW}/${interview.Interview.InterviewID}?showGrid=true`);
  }

  const getQuestionsProgress = () => {
    return `${interview?.Progress?.TotalInterviewQuestionsAnswered} 
    of ${interview?.Progress?.TotalInterviewQuestionCount} questions`;
  }

  return (
    <>
      <Card>
        <CardContent className={styles.module_progress_container}>
          <div className={styles.module_icon_container}>
            <Avatar className={styles.module_icon_blue}>
              <Icon>chat</Icon>
            </Avatar>
          </div>
          <div className={styles.module_title_container}>
            <div className={styles.module_title}>{interview?.InterviewTemplate?.InterviewTemplateName}</div>
          </div>
          <Grid className={styles.module_progress_footer} container spacing={1}>
            <Grid item xs={6}>
              {getQuestionsProgress()}
            </Grid>
            <Grid item xs={6} className={styles.flex}>
              {progress?.toFixed(0)}%
            </Grid>
          </Grid>
          <BarProgressIndicator className={styles.module_progress_indicator}
                                variant="determinate"
                                value={progress} />
        </CardContent>
        <CardActions>
          <Button fullWidth={true}
                  onClick={() => select()}
                  color="primary"
                  size="large"
                  className={styles.module_button}>
            Continue
            <Icon>arrow_forward</Icon>
          </Button>
        </CardActions>
      </Card>
      <br />
    </>
  )
}

export default InterviewItem;
