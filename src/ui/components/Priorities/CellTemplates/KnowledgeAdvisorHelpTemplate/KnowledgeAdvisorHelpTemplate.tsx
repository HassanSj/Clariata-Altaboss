import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import {MAX_CELL_STR_LENGTH} from "~/ui/components/Priorities/PriorityItem/PriorityItem";

const KnowledgeAdvisorHelpTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'textarea',
          label: 'How can I help you access the knowledge you will need?',
          field: {
            name:'KnowledgeAdvisorHelp',
            value:props?.objective?.KnowledgeAdvisorHelp
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <StringValue value={props?.objective?.KnowledgeAdvisorHelp} maxLength={MAX_CELL_STR_LENGTH * 2}/>
      </DataTableCell>
    </>
  )
}

export default KnowledgeAdvisorHelpTemplate;