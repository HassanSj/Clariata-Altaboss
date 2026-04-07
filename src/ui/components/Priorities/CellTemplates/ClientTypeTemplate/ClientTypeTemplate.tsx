import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import StringValue from "~/ui/components/Data/Formatters/StringValue";

const ClientTypeTemplate = ({props}: IPriorityItemCellTemplateConfig) => {

  const UserTypeText = (userTypeID: number) => {
    switch(userTypeID) {
      case 1:
        return 'Admin';
      case 2:
        return 'Company Admin';
      case 3:
        return 'Advisor';
      case 4:
        return 'Client';
      default:
        return 'Advisor/Client';
    }
  }

  return (
    <>
      {/* <DataTableCell inputProps={{
        type: 'text',
        label: 'Who',
        field: {
          name: 'UserTypeID',
          value: props?.directionTask?.UserTypeID
        }
      }}> */}
      <DataTableCell>
        <StringValue value={UserTypeText(props?.directionTask?.UserTypeID as number)} maxLength={50} />
      </DataTableCell>
    </>
  )
}

export default ClientTypeTemplate;
