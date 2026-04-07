import React from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import EditEvaluation from "~/ui/components/Evaluations/EditEvaluation";
import Card from "@material-ui/core/Card";
import classnames from "classnames";
import styles from "~/ui/components/Contact/BrowseContacts/BrowseContacts.module.scss";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import {SortDirection} from "~/ui/constants/data";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import {Grid, TextField} from "@material-ui/core";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import EvaluationItem from "~/ui/components/Evaluations/EvaluationItem";
import useDataPagination from "~/ui/hooks/useDataPagination";

const EvaluationsList = () => {
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const { evaluations } = useStoreState(state => state.evaluation);
  const { onSelect } = useStoreActions(actions => actions.evaluation);

  const handleCreate = async (evaluation: ClientEvaluation) => {
    // show evaluation creation
  }

  const handleSelect = async (evaluation: ClientEvaluation) => {
    const res = await onSelect(evaluation).then(() => {
      // TODO - show loading
      // TODO - forward user to evaluation page
    });
  }

  // Pagination
  const {
    searchText,
    sortDirection,
    setSortDirection,
    paginator
  } = useDataPagination(evaluations, 5, 'Description');
  const handleChange = (e: any, p: number) => {
    paginator.jump(p);
  };

  return (
    <>
      <Card className={classnames(styles.root)}>
        <CardContent>
          <DataWrapper isGrouped={false}
                       paginator={paginator}
                       propLabel="evaluation"
                       keyLabel="ClientEvaluationID"
                       component={EvaluationItem} />
        </CardContent>
      </Card>
      <EditEvaluation isOpen={showEditDialog}
                   onClose={() => setShowEditDialog(false)}></EditEvaluation>
    </>
  );
};

export default EvaluationsList;
