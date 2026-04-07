import {useRouter} from "next/router";
import React from "react";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "~/ui/components/Widgets/Widgets.module.scss";
import {Button, Grid} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import paths from "~/ui/constants/paths";
import classnames from "classnames";
import BarProgressIndicator from "../../Indicators/BarProgressIndicator";

const { DIRECTION_PRIORITIES } = paths;

const PriorityProgressWidget = () => {
  const router = useRouter();

  const select = () => {
    router.push(DIRECTION_PRIORITIES);
  }

  return (
    <Widget title={'Priority'}>
        <span className={classnames(styles.cl_dark_blue, styles.cl_icon, styles.cl_icon_priority)}/>
        <span className={styles.cl_box_title}>Priority Progress</span>
        <span className={styles.cl_box_txt}>Milestones for each action step are established to measure progress. Each milestone lists the specific tasks to be done to reach each milestone. </span>
        <div className={styles.cl_bottom}>
        {/*<span className={styles.cl_box_progress}>*/}
        {/*  <Grid className={styles.module_progress_footer} container>*/}
        {/*    <Grid item xs={6} className={styles.left}>*/}
        {/*      /!* {getQuestionsProgress()} *!/*/}
        {/*      Action Items*/}
        {/*      /!* TO DO *!/*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={6} className={styles.right}>*/}
        {/*      /!* {computeProgress()?.toFixed(0)}% *!/*/}
        {/*      44%*/}
        {/*    </Grid>*/}
        {/*  </Grid>*/}
        {/*  <BarProgressIndicator className={styles.module_progress_indicator}*/}
        {/*                        variant="determinate"*/}
        {/*                        // value={computeProgress()} />*/}
        {/*                        value={44} />*/}
        {/*  <div className={styles.footer_actions}>*/}
        {/*    <Button fullWidth={true}*/}
        {/*            // onClick={() => select()}*/}
        {/*            color="primary"*/}
        {/*            variant="outlined"*/}
        {/*            size="large"*/}
        {/*            className={styles.module_button}>*/}
        {/*      Continue*/}
        {/*      <Icon>arrow_forward</Icon>*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</span>*/}
        </div>
    </Widget>
  )
}

export default PriorityProgressWidget;
