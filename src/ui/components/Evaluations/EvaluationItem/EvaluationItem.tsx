import React from "react";
import {useStoreState} from "~/store/hooks";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {Avatar, Icon, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {Household} from "~/types/api/household";
import { IDataItemEventConfig } from "~/types/data";

const { EVALUATION } = paths;

interface IProps {
  evaluation: ClientEvaluation,
  eventConfig: IDataItemEventConfig
}

const EvaluationItem = ({ evaluation, eventConfig }: IProps) => {
  const router = useRouter();
  const { households } = useStoreState((state) => state.household);
  const [household, setHousehold] = React.useState<Household | undefined>();

  const handleSelectEvaluation = async () => {
    if (eventConfig?.onSelect) {
      eventConfig.onSelect(evaluation);
    }
  }

  return (
    <>
      <ListItem>
        {/* <ListItemAvatar>
          <Avatar>
            <Icon>perm_identity</Icon>
          </Avatar>
        </ListItemAvatar> */}
        <ListItemText primary={evaluation?.Description} onClick={() => handleSelectEvaluation()}/>
      </ListItem>
    </>
  )
}

export default EvaluationItem;