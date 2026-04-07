import React from "react";
import {Objective} from "~/types/api/objective";
import {useStoreState} from "~/store/hooks";
import useMountEvents from "~/ui/hooks/useMountEvents";
import Widget from "~/ui/components/Widgets/Widget";
import {isNullOrUndefined} from "~/ui/constants/utils";
import paths from "~/ui/constants/paths";

const ObjectiveWidget = () => {
  const { objectives } = useStoreState(state => state.objective);
  const [firstObjective, setFirstObjective] = React.useState<Objective | undefined>();

  const findAndSetFirstObjective = () => {
    const objective = objectives?.find(o => o.Rank === 1);
    setFirstObjective(objective);
  }

  const setup = () => {
    findAndSetFirstObjective();
  }

  useMountEvents({
    onMounted: async () => {
      setup();
    },
    onChange: async () => {
      setup();
    },
    watchItems: [objectives]
  });

  return (
    <>
      <Widget hide={isNullOrUndefined(firstObjective)}
              title={firstObjective?.Description}
              image={firstObjective?.SuccessImageURL}
              link={paths.DIRECTION_PRIORITIES}>
      </Widget>
    </>
  )
}

export default ObjectiveWidget;
