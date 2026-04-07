import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {objectiveTimingFrequency} from "~/ui/constants/objectives";
import {ListItem, ListItemText} from "@material-ui/core";
import CurrencyValue from "~/ui/components/Data/Formatters/CurrencyValue";
import EnumValue from "~/ui/components/Data/Formatters/EnumValue";
import React from "react";

const FundingAmountsTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectiveTimingFrequency,
          label: 'Installment frequency',
          field: {
            name:'InstallmentFrequency',
            value:props?.objective?.InstallmentFrequency
          }
        }}
        inputProps2={{
          type: 'number',
          label: 'Installment Amount',
          field: {
            name:'InstallmentAmount',
            value:props?.objective?.InstallmentAmount
          }
        }}
        inputProps3={{
          type: 'number',
          label: 'What is the total amount?',
          field: {
            name:'TotalFundingAmount',
            value:props?.objective?.TotalFundingAmount
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        {(props?.objective?.InstallmentAmount && props?.objective?.InstallmentAmount >= 0) ?
          <ListItem>
            <ListItemText
              primary={
                <>
                  <CurrencyValue amount={props?.objective?.InstallmentAmount}/><EnumValue
                  value={props?.objective?.InstallmentFrequency} options={objectiveTimingFrequency}
                  labelField="label" valueField="value"/>
                </>
              }
              secondary="Installments"/>
          </ListItem>
          :
          <ListItem>
            <ListItemText
              primary={
                <>
                  <CurrencyValue amount={props?.objective?.TotalFundingAmount}/>
                </>
              }
              secondary="Single payment"/>
          </ListItem>
        }
      </DataTableCell>
    </>
  )
}

export default FundingAmountsTemplate;
