import {Objective} from "~/types/api/objective";
import React from "react";
import {Chip} from "@material-ui/core";
import styles from './InterviewStepObjective.module.scss';

interface IProps {
  objective: Objective;
}

const InterviewStepObjective = ({ objective }: IProps) => {
  return (
    <>
      <Chip
        className={styles.objective}
        label={objective?.Description}
        color="secondary"
      />
    </>
  )
}

export default InterviewStepObjective;