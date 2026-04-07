import React, {CSSProperties, ReactElement} from "react";
import classnames from "classnames";
import {Grid} from "@material-ui/core";
import {useDrop} from "react-dnd";
import {ACTION_ITEM_DRAG_TYPE} from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/DraggableActionItem";
import {ActionItem} from "~/types/api/actionItem";
import {constructDate} from "~/ui/components/Modules/Direction/ActionItemRecurringModal/ActionItemRecurringModal";
import {createOrUpdateDirect} from "~/ui/components/ActionItems/EditActionItem/EditActionItem";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreActions, useStoreState} from "~/store/hooks";
import style from "./ActionItemDropTarget.module.css"

interface IProps{
    children?: React.ReactNode,
    targetYear: number,
    targetMonth: number,
    onDropEnd? : ()=>void,
    objectiveID: number|string
    selected?:boolean
}

const ActionItemDropTarget = ({children,selected,targetYear,targetMonth,onDropEnd,objectiveID}:IProps):ReactElement => {
    const notification = useNotifications()
    const { selectedHousehold } = useStoreState(state => state.household);
    const { dreamInterviewId } = useStoreState(state => state.interview);
    const { onRefresh } = useStoreActions(actions => actions.objective);

    const [{isOver}, drop] = useDrop({
        accept: ACTION_ITEM_DRAG_TYPE+"_"+objectiveID,
        collect: (monitor:any) => ({isOver: monitor.isOver()}),
        drop: async (e: {item: ActionItem}) => {
            notification.toggleLoading(true)
            e.item.StartDate = constructDate(targetMonth, targetYear)

            await createOrUpdateDirect(
                e.item,
                selectedHousehold?.HouseholdID,
                dreamInterviewId,
                notification,
                onRefresh,
                undefined);
            if(onDropEnd)
                onDropEnd()
            notification.toggleLoading(false)
        }
    })

    return (
        <Grid item xs={1}>
            <div
                className={classnames("item_cell",{selected}, isOver ? style['drag-over'] : "", 'box')}
                ref={drop}>
                {children}
            </div>
        </Grid>
    )
}

export default ActionItemDropTarget