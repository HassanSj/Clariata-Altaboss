import React, {useCallback, useMemo} from "react";
import {IDataItemEvent} from "~/types/data";
import {moveItemByField} from "~/ui/constants/data";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {processServerError} from "~/services/api/errors";
import api from "~/services/api";
import { ChecklistItem } from "~/types/api/checklistItem";

const useChecklistDraggables = <T>(data: T[],
                          itemIdField: string,
                          enabled: boolean = true,
                          onUpdate?: (updated: ChecklistItem[]) => unknown,
                          updateEnabled: boolean = false) => {

  const { lastDragEvent } = useStoreState(state => state.layout);
  const { onDragEvent, onDragging } = useStoreActions(actions => actions.layout);

  const [items, setItems] = React.useState<T[]>();
  const [events, setEvents] = React.useState<IDataItemEvent[]>([]);
  const {selectedHousehold} = useStoreState(state => state.household);
  const {dreamInterviewId} = useStoreState(state => state.interview);

  const getCurrentData = () => {
    if (events) {
      events?.forEach(e => {
        // @ts-ignore
        data = moveItemByField(
          Object.assign([], data),
          itemIdField,
          String(e.itemId),
          String(e.targetItemId));
      })
    }

    return data;
  }

  const onDraggedEvent = (event: IDataItemEvent) => {
    if ((lastDragEvent?.targetItemId!==event?.targetItemId)
      && lastDragEvent?.itemId!==event?.itemId) {
       onDragEvent(event);
    }
  }
  const handleDragEvent = useCallback((e) => onDraggedEvent(e), []);

  // const getApiData = async () => {
  //   const apiData = await api.objective.list(
  //     selectedHousehold.HouseholdID,
  //     dreamInterviewId);

  //   return apiData?.data as Objective[];
  // }

  const onDropEvent = async (event: IDataItemEvent) => {
    try {
      if (enabled && event.itemId && event.targetItemId) {
        await onDragEvent(undefined);
        setEvents([...events, event]);
        // const apiData = await getApiData();
        const updatedData = moveItemByField(
          Object.assign([], data),
          itemIdField,
          String(event.itemId),
          String(event.targetItemId));
        if (updatedData) {
          // @ts-ignore
          setItems(updatedData);
          if (onUpdate && updateEnabled) {
            // debugger
            // @ts-ignore
            onUpdate(updatedData);
          }
        }
      }
    } catch (e) {
      processServerError(e, 'useDraggables.onDropEvent');
    }
  }
  const handleDropEvent = useCallback((e) => {
    onDropEvent(e);
  }, []);
  const handleDragEnd = useCallback((e) => {
    onDragging(false);
    onDragEvent(undefined);
  }, []);

    return {
      draggedItems: getCurrentData(),
      handleDropEvent,
      lastDragEvent,
      handleDragEvent,
      handleDragEnd
    };

};
export default useChecklistDraggables;
