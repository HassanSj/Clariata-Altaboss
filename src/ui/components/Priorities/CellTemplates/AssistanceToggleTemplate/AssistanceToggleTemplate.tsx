import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {Button, ButtonGroup, ListItem} from "@material-ui/core";
import React from "react";

const AssistanceToggleTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {

  const toggleAssistance = () => {
    props?.onSelect();
    props?.onUpdateFields([
      {
        field: 'AssistanceNeeded',
        value: props?.objective?.AssistanceNeeded ? false : true
      },
      {
        field: 'DIY',
        value: false
      }
    ])
  }

  const toggleDIY = () => {
    props?.onSelect();
    props?.onUpdateFields([
      {
        field: 'AssistanceNeeded',
        value: false
      },
      {
        field: 'DIY',
        value: props?.objective?.DIY ? false : true
      }
    ])
  }

  return (
    <>
      <DataTableCell>
        <ListItem>
          <ButtonGroup fullWidth={true}
                       color="primary"
                       disableElevation={true}
                       variant="contained">
            <Button color={props?.objective?.DIY ? 'primary' : 'default'}
                    onClick={() => toggleDIY()}>DIY</Button>
            <Button color={props?.objective?.AssistanceNeeded ? 'primary' : 'default'}
                    onClick={() => toggleAssistance()}>Assistance</Button>
          </ButtonGroup>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default AssistanceToggleTemplate;
