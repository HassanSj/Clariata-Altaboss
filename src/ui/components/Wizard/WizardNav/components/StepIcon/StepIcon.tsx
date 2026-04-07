import {makeStyles} from "@material-ui/core/styles";
import {StepIconProps} from "@material-ui/core/StepIcon";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import React from "react";
import {Icon} from "@material-ui/core";
import styles from './StepIcon.module.scss';

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#78c1c7',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#78c1c7',
    zIndex: 1,
    fontSize: 30,
  },
});

const StepIcon = (props: StepIconProps) => {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}>
      {completed ?
        <Check className={classes.completed} />
        :
        <Icon className={styles.icon}>dynamic_form</Icon>
      }
    </div>
  )
}

export default StepIcon;
