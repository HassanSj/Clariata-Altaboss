import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {ListItem, ListItemText} from "@material-ui/core";
import React from "react";

const RankingTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell>
        <ListItem>
          <ListItemText primary={(props?.objective?.Rank || props?.objective?.Rank===0) ? (Number(props?.objective?.Rank) + 1) : null} />
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default RankingTemplate;