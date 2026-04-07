import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {objectiveKnowledgeLevels, objectiveKnowledgeTask} from "~/ui/constants/objectives";
import {ListItem, ListItemText} from "@material-ui/core";
import EnumValue from "~/ui/components/Data/Formatters/EnumValue";
import React from "react";

const KnowledgeNeededTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectiveKnowledgeLevels,
          label: 'What level of knowledge will you need in pursuing this priority?',
          field: {
            name:'KnowledgeNeeded',
            value:props?.objective?.KnowledgeNeeded
          }
        }}
        inputProps2={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectiveKnowledgeTask,
          label: 'What needs to be done to get you the knowledge you need to pursue this priority?',
          field: {
            name:'KnowledgeTask',
            value:props?.objective?.KnowledgeTask
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}
        >
        <ListItem>
          <ListItemText
            primary={<EnumValue value={props?.objective?.KnowledgeNeeded} options={objectiveKnowledgeLevels}
                                labelField="label" valueField="value"/>}
            secondary={<EnumValue value={props?.objective?.KnowledgeTask} options={objectiveKnowledgeTask}
                                  labelField="label" valueField="value"/>}/>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default KnowledgeNeededTemplate;
