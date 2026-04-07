import React from 'react';
import {Objective} from "~/types/api/objective";

import DirectionStrategySchedulerTab from "~/ui/components/Modules/Direction/DirectionStrategySchedulerTab";
import DirectionStrategySummaryTab from "~/ui/components/Modules/Direction/DirectionStrategySummaryTab";


interface IProps {
  item?: Objective;
  items?: Objective[];
  tab: number;
}

const DirectionStrategy = ({ item, items, tab }: IProps) => {
  const tabs = [
      (<DirectionStrategySchedulerTab item={item} items={items}/>),
      (<DirectionStrategySummaryTab item={item} items={items}/>),
  ]

  return (
      <>{tabs[tab]}</>
  );
};

export default DirectionStrategy;
