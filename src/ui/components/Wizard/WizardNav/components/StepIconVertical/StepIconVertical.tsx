import {makeStyles} from "@material-ui/core/styles";
import {StepIconProps} from "@material-ui/core/StepIcon";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import React from "react";

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 15,
    alignItems: 'center',
  },
  active: {
    color: '#78c1c7',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#78c1c7',
    zIndex: 1,
    fontSize: 18,
  },
});

const StepIconVertical = (props: StepIconProps) => {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}>
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  )
}

export default StepIconVertical;
