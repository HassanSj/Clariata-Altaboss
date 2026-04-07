import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React, { useState } from "react";
import { IChecklistItemCellTemplateConfig } from "~/types/checklist/checklistItem";
import useMountEvents from "~/ui/hooks/useMountEvents";
import api from "~/services/api";
import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { ReportTypes } from "~/ui/constants/reports";

const ReportTemplate = ({props}:IChecklistItemCellTemplateConfig) => {

        const [data, setData] = useState<any>();
        const loadResources = async () => {
          const res = await api.resource.getAllResources();
          setData(res?.data);
        };
        useMountEvents({
          onMounted: async () => {
            await loadResources();
          },
        });

    return (
      <>
        <DataTableCell
          inputProps={{
            type: 'text',
            label: 'Report',
            field: {
              name: 'Report',
              value: props?.checklistitem?.ChecklistItemReport,
            },
          }}
          editable={false}
        >
          {props?.checklistitem?.ChecklistItemReport
            ? props?.checklistitem?.ChecklistItemReport?.split(',').map((reportItem, i) => {
                return (
                  <>
                    <ListItem key={'r' + i}>
                      <ListItemIcon>
                        <Icon>{ReportTypes[reportItem].icon}</Icon>
                      </ListItemIcon>
                      <ListItemText primary={ReportTypes[reportItem].name} />
                    </ListItem>
                  </>
                );
              })
            : null}
        </DataTableCell>
      </>
    );
}

export default ReportTemplate;