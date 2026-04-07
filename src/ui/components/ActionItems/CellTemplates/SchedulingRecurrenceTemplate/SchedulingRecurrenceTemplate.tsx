import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import {actionItemTimingFrequency, getRecurrenceFrequencyType, RecurrenceFrequencyType} from "~/ui/constants/tasks";

const SchedulingRecurrenceTemplate = ({ props }: IActionItemCellTemplateConfig) => {

  const formatRecurrence = () => {
    const recurrenceType = Math.floor(Math.random() * (7 - 1) + 1);
    if (recurrenceType) {
      const recurrenceTypeLabel = getRecurrenceFrequencyType(recurrenceType);
      if (recurrenceType === RecurrenceFrequencyType.ONCE) {
        return recurrenceTypeLabel?.label;
      } else {
        return `Every ${recurrenceTypeLabel?.singular}`;
      }
    }
  }

  return (
    <>
      <DataTableCell inputProps={{
                       type: 'select',
                       labelField: 'label',
                       valueField: 'value',
                       items: actionItemTimingFrequency,
                       label: 'Frequency',
                       field: {
                         name:'RecurrenceType',
                         value: props?.item?.RecurrenceType
                       }
                     }}
                     onSave={(e) => props?.onUpdateFields(e)}>
        {formatRecurrence()}
      </DataTableCell>
    </>
  )
}

export default SchedulingRecurrenceTemplate;
