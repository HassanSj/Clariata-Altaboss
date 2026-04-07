import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {objectiveFundingNeeds} from "~/ui/constants/objectives";
import {ListItem, ListItemText} from "@material-ui/core";
import EnumValue from "~/ui/components/Data/Formatters/EnumValue";
import CurrencyValue from "~/ui/components/Data/Formatters/CurrencyValue";
import React from "react";

const FundingKnownTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: objectiveFundingNeeds,
          label: 'What do you think the funding needs will be to pursue this priority?',
          field: {
            name:'FundingKnown',
            value:props?.objective?.FundingKnown
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <ListItem>
          <ListItemText primary={<EnumValue value={props?.objective?.FundingKnown} options={objectiveFundingNeeds}
                                            labelField="label" valueField="value"/>}
                        secondary={<CurrencyValue amount={props?.objective?.TotalFundingAmount}/>}/>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default FundingKnownTemplate;
