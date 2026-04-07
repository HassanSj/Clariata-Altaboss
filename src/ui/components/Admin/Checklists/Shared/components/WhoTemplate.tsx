import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import { IChecklistItemCellTemplateConfig } from "~/types/checklist/checklistItem";

const WhoTemplate = ({props}:IChecklistItemCellTemplateConfig) => {
    return (
      <>
        <DataTableCell
          inputProps={{
            type: 'text',
            label: 'Who',
            field: {
              name: 'Who',
              value: props?.checklistitem?.ChecklistItemWho,
            },
          }}
          editable={false}
        >
          <StringValue value={`${props?.checklistitem?.ChecklistItemWho ?? 0}`} maxLength={50} />
        </DataTableCell>
      </>
    );
}

export default WhoTemplate;