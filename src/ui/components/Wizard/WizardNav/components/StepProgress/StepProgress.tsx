import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import CircularProgress, {CircularProgressProps} from "@material-ui/core/CircularProgress";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import styles from "~/ui/components/Wizard/Wizard/Wizard.module.scss";
import React from "react";

const useProgressStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorPrimary: {
      color: '#3498db',
    },
  }),
);

const StepProgress = (props: CircularProgressProps & { value: number }) => {
  const classes = useProgressStyles();

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} classes={classes} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center">
        <Typography variant="caption" component="div" className={styles.wizard_nav_step_inprogress_indicator_label}>
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default StepProgress;