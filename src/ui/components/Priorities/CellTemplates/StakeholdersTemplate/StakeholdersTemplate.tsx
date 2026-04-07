import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import {AvatarGroup} from "@material-ui/lab";
import {hasItems} from "~/ui/constants/utils";
import {Avatar, Tooltip} from "@material-ui/core";
import {getFullName, getPhotoUrlOrDefault} from "~/ui/constants/user";
import React from "react";

const StakeholdersTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <AvatarGroup max={4}>
        {hasItems(props?.objective?.Stakeholders) ? props?.objective?.Stakeholders?.map((stakeholder: any, sindex: number) => {
          return (
            <Tooltip title={getFullName(stakeholder?.Person)}
                     key={stakeholder?.ObjectiveStakeholderID}>
              <Avatar alt={getFullName(stakeholder?.Person)}
                      src={getPhotoUrlOrDefault(stakeholder?.Person)}
                      onClick={() => (props?.onEditStakeholder ? props?.onEditStakeholder(stakeholder) : undefined)}/>
            </Tooltip>
          )
        }) : null}
      </AvatarGroup>
    </>
  )
}

export default StakeholdersTemplate;