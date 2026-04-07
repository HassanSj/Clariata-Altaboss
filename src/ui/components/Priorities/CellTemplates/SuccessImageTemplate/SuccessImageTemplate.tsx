import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import {AvatarGroup} from "@material-ui/lab";
import {Avatar} from "@material-ui/core";
import React from "react";

const SuccessImageTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      {props?.objective?.SuccessImageURL ?
        <AvatarGroup max={4}>
          <Avatar alt="Success image" src={props?.objective?.SuccessImageURL}/>
        </AvatarGroup>
        : null}
    </>
  )
}

export default SuccessImageTemplate;