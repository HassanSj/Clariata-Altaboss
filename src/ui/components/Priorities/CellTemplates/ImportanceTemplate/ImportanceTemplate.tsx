import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {ListItem, ListItemText} from "@material-ui/core";
import React from "react";
import {objectiveImportanceCategories} from "~/ui/constants/objectives";
import EnumValue from "~/ui/components/Data/Formatters/EnumValue";

const ImportanceTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectiveImportanceCategories,
          label: 'How would you categorize this priority? Is it an essential, important, or aspirational priority?',
          field: {
            name:'Importance',
            value:props?.objective?.Importance
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <ListItem>
          <ListItemText
            primary={<EnumValue value={props?.objective?.Importance} options={objectiveImportanceCategories}
                                labelField="label" valueField="value"/>}/>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default ImportanceTemplate;
