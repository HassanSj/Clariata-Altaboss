import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {Button, ButtonGroup, ListItem} from "@material-ui/core";
import React from "react";

const PriorityToggleTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {

  const toggle = (priorityNow: boolean) => {
    props?.onUpdateFields([
      {
        field: 'PriorityNow',
        value: priorityNow
      }
    ])
  }

  return (
    <>
      <DataTableCell>
        <ListItem>
          <ButtonGroup fullWidth={true}
                       color="primary"
                       variant="contained">
            <Button color={props?.objective?.PriorityNow ? 'primary' : 'default'}
                    onClick={() => toggle(true)}>Now</Button>
            <Button color={!props?.objective?.PriorityNow ? 'primary' : 'default'}
                    onClick={() => toggle(false)}>Later</Button>
          </ButtonGroup>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default PriorityToggleTemplate;