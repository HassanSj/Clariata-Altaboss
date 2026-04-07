import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {objectiveYesNoTypes} from "~/ui/constants/objectives";
import {ListItem, ListItemText} from "@material-ui/core";
import EnumValue from "~/ui/components/Data/Formatters/EnumValue";
import React from "react";

const KnowledgeYesNoTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectiveYesNoTypes,
          label: 'Do you know what it will take to pursue this priority?',
          field: {
            name:'KnowledgeYesNo',
            value:props?.objective?.KnowledgeYesNo
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <ListItem>
          <ListItemText primary={<EnumValue value={props?.objective?.KnowledgeYesNo} options={objectiveYesNoTypes}
                                            labelField="label" valueField="value"/>}/>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default KnowledgeYesNoTemplate;
