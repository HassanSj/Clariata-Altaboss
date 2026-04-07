import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {Checkbox, FormControlLabel, ListItem, ListItemText, Snackbar} from "@material-ui/core";
import React from "react";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {IObjectiveDataType} from "~/types/objective/store";
import {MAX_OBJECTIVES} from "~/ui/constants/objectives";
import useNotifications from "~/ui/hooks/useNotifications";
import styles from "./PrioritySelectTemplate.module.scss";
import { Alert } from "@material-ui/lab";

const PrioritySelectTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  const { selectedObjectiveIds } = useStoreState((state) => state.objective);
  const { onSelect } = useStoreActions(actions => actions.objective);
  const [ isMoreThan10, setIsMoreThan10 ] = React.useState(false);

  const handleErrorClose = () => {
    setIsMoreThan10(false);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target.checked && canSelect()) || !event.target.checked) {
      const adjusted = { ...selectedObjectiveIds, [event.target.name]: event.target.checked };
      onSelect({
        type: IObjectiveDataType.OBJECTIVE_IDS,
        objectiveIds: adjusted,
        objectiveId: event.target.name,
        selected: event.target.checked
      });
    } else {
      event.stopPropagation();
      setIsMoreThan10(true);
    }
  };

  const canSelect = () => {
    const count = getSelectedCount();
    return count < MAX_OBJECTIVES;
  }

  const getSelectedCount = () => {
    let count = 0;
    if (selectedObjectiveIds) {
      for (const [key, value] of Object.entries(selectedObjectiveIds)) {
        if (value) {
          count++;
        }
      }
    }
    return count;
  }

  return (
    <>
      <DataTableCell>
        <ListItem>
          <ListItemText className={styles.select_container}>
            <FormControlLabel
              control={<Checkbox checked={selectedObjectiveIds ? selectedObjectiveIds[props?.objective?.ObjectiveID]  ?? false : false}
                                 // onClick={(event) => {
                                 //   if (!canSelect()) {
                                 //     event.stopPropagation();
                                 //     notifications.addErrorNotification(`A maximum of ${MAX_OBJECTIVES} can be selected.`);
                                 //   }
                                 // }}
                                 onChange={handleChange}
                                 name={String(props?.objective?.ObjectiveID)} />}
              label=""
            />
          </ListItemText>
        </ListItem>
      </DataTableCell>
      <Snackbar open={isMoreThan10} autoHideDuration={1000} onClose={handleErrorClose}>
        <Alert severity="error" onClose={handleErrorClose}>
          A maximum of {MAX_OBJECTIVES} can be selected.
        </Alert>
      </Snackbar>
    </>
  )
}

export default PrioritySelectTemplate;
