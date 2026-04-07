import React, {ReactElement} from "react";
import {ActionItem} from "~/types/api/actionItem";
import classnames from "classnames";
import monthStyles
    from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/DirectionStrategySummaryPriorityItem.module.css";
import {useDrag} from "react-dnd";

interface IProps{
    item?: ActionItem,
    onClick: (item: ActionItem)=>void,
    objectiveID: number|string
}

export const ACTION_ITEM_DRAG_TYPE = "action_item"

const DraggableActionItem = ({item,onClick,objectiveID}:IProps):ReactElement => {
    const [, drag] = useDrag({
        item: {
            type:ACTION_ITEM_DRAG_TYPE+"_"+objectiveID,
            item
        }
    })

    return (
        <>
            { item !== undefined ?
                (<div
                    ref={drag}
                    className={classnames(monthStyles.actionItemWrapper,"clickable","item_clickable")}
                    onClick={() => onClick(item)}>
                    {item.Description}
                </div>) : null }
        </>
    )
}

export default DraggableActionItem