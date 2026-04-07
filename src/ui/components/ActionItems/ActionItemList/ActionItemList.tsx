import {ActionItem as ActionItemModel} from "~/types/api/actionItem";
import {hasItems} from "~/ui/constants/utils";
import React, {useEffect} from "react";
import ActionItem from "~/ui/components/ActionItems/ActionItem";
import {useStoreState} from "~/store/hooks";
import useMountEvents from "~/ui/hooks/useMountEvents";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import usePagination from "~/ui/hooks/usePagination";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import {actionItemViews, directionActionItemViews} from "~/ui/constants/actionitems";
import DirectionActionItem from "~/ui/components/Modules/Direction/DirectionActionItem";
import DirectionStrategyActionItem from "~/ui/components/Modules/Direction/DirectionStrategyActionItem";
import {Objective} from "~/types/api/objective";
import {DataView} from "~/ui/components/Modules/Direction/DirectionStrategySchedulerTab/DirectionStrategySchedulerTab";

interface IProps {
  objectiveId: number;
  objective?: Objective;
  parent?: ActionItemModel;
  items?: ActionItemModel[];
  requiresFetch?: boolean;
  onChange?: any;
  onCountChange?: any;
  isDirection?: boolean;
  includeHeaders?: boolean;
}

const ActionItemList = ({ items, objectiveId,objective, parent, requiresFetch = false, onChange, onCountChange, isDirection = true, includeHeaders = true }: IProps) => {
  const [actionItems, setActionItems] = React.useState(items);

  const { selectedHousehold } = useStoreState((state) => state.household);

  const loadTasks = async () => {
    try {
      const res = await api.actionitem.listFull(
        selectedHousehold?.HouseholdID,
        objectiveId,
        (parent?.ActionItemID ? parent?.ActionItemID : 0));
      if (hasItems(res)) {
        setActionItems(res);
      }
      if (onChange) onChange();
      if (onCountChange) onCountChange(hasItems(res) ? res?.length : 0);
    } catch (err) {
      processServerError(err, 'ActionItemList.loadTasks');
    }
  }

  // Pagination
  const paginator = usePagination(actionItems, 5);

  useMountEvents({
    onMounted: async () => {
      if (requiresFetch) {
        await loadTasks();
      }
    },
  });

  useEffect(() => {
    setActionItems(items)
  }, [items])

  return (
    <>
      { includeHeaders ? <DataTableHeaders headers={isDirection ? DataView.headers : actionItemViews[0].headers}/> : null }
      <DataWrapper paginator={paginator}
                   keyLabel="ActionItemID"
                   propLabel="item"
                    componentProps={{
                      objectiveProp: objective
                    }}
                   // component={isDirection ? DirectionActionItem : ActionItem} />
                   component={DirectionStrategyActionItem}/>
    </>
  )
}

export default ActionItemList;
