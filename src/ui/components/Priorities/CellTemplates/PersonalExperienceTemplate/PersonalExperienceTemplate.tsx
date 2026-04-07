import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import {MAX_CELL_STR_LENGTH} from "~/ui/components/Priorities/PriorityItem/PriorityItem";

const PersonalExperienceTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'textarea',
          label: 'Personal Experience',
          field: {
            name:'PersonalExperience',
            value:props?.objective?.PersonalExperience
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <StringValue value={props?.objective?.PersonalExperience} maxLength={MAX_CELL_STR_LENGTH}/>
      </DataTableCell>
    </>
  )
}

export default PersonalExperienceTemplate;