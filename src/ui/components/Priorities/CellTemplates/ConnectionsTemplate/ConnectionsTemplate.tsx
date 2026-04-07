import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import {AvatarGroup} from "@material-ui/lab";
import {Avatar, Tooltip} from "@material-ui/core";
import {getFullName, getPhotoUrlOrDefault} from "~/ui/constants/user";
import React from "react";

const ConnectionsTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <AvatarGroup max={4}>
        {props?.connections?.map((connection: any, sindex: number) => {
          return (
            <Tooltip title={getFullName(connection)} key={connection?.PersonID}>
              <Avatar alt={getFullName(connection)} src={getPhotoUrlOrDefault(connection)}/>
            </Tooltip>
          )
        })}
      </AvatarGroup>
    </>
  )
}

export default ConnectionsTemplate;