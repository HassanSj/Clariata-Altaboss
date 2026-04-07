import React from 'react';
import EvaluationsList from "~/ui/components/Evaluations/EvaluationsList";
import {Button, Grid} from "@material-ui/core";
import classnames from "classnames";
import styles from "~/ui/components/Contact/BrowseContacts/BrowseContacts.module.scss";
import EditEvaluation from "~/ui/components/Evaluations/EditEvaluation";

const Evaluations = () => {
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  return (
    <>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} className={classnames(styles.actions_row)}>
          <Button onClick={() => setShowEditDialog(true)}
                  variant="contained"
                  color='primary'>
            Add Evaluation
          </Button>
        </Grid>
      </Grid>
      <EvaluationsList />
      <EditEvaluation isOpen={showEditDialog}
                      onClose={() => setShowEditDialog(false)}></EditEvaluation>
    </>
  );
};

export default Evaluations;
