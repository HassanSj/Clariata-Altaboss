import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {objectivePersonalImpacts} from "~/ui/constants/objectives";
import {ListItem, ListItemText} from "@material-ui/core";
import EnumValue from "~/ui/components/Data/Formatters/EnumValue";
import React from "react";

const PersonalImpactLevelTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectivePersonalImpacts,
          label: 'How will your personal experiences impact your pursuit of this priority?',
          field: {
            name:'PersonalImpactLevel',
            value:props?.objective?.PersonalImpactLevel
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <ListItem>
          <ListItemText
            primary={<EnumValue value={props?.objective?.PersonalImpactLevel} options={objectivePersonalImpacts}
                                labelField="label" valueField="value"/>}/>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default PersonalImpactLevelTemplate;
