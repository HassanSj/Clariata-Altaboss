import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React, { useState } from "react";
import { IChecklistItemCellTemplateConfig } from "~/types/checklist/checklistItem";
import api from "~/services/api";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { ListItem, ListItemText } from "@material-ui/core";
import { Resource } from "~/types/api/resource";

const ResourceTemplate = ({ props }: IChecklistItemCellTemplateConfig) => {
  const [resources, setResources] = useState<Resource[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const loadResources = async () => {
    setLoading(true);
    const res = await api.resource.getAllResources();
    setResources(res?.data);
  };
  useMountEvents({
    onMounted: async () => {
      await loadResources();
      setLoading(false);
    },
  });
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'text',
          label: 'Resource',
          field: {
            name: 'Resource',
            value: props?.checklistitem?.ChecklistItemResource,
          },
        }}
        editable={false}
      >
        {props?.checklistitem?.ChecklistItemResource?.length > 0 && !loading
          ? props?.checklistitem?.ChecklistItemResource?.split(',').map((obj, i) => {
              const resourceById = resources?.filter((res: any) => res?.ResourceId == Number(obj));
              return (
                <>
                  <ListItem key={'s' + i}>
                    <ListItemText primary={resourceById ? resourceById[0]?.ResourceTitle : null} />
                  </ListItem>
                </>
              );
            })
          : 'Loading...'}
      </DataTableCell>
    </>
  );
};

export default ResourceTemplate;