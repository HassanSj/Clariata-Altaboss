import {NavigationTab} from "~/ui/constants/navigations";
import React from "react";
import DirectionWrapper from "~/ui/components/Modules/Direction/DirectionWrapper";
import DirectionPriorities from "~/ui/components/Modules/Direction/DirectionPriorities";

const Priorities = () => {

  return (
    <>
      <DirectionWrapper tab={NavigationTab.DIRECTION_PRIORITIES}>
        <DirectionPriorities />
      </DirectionWrapper>
    </>
  )
}

export default Priorities;