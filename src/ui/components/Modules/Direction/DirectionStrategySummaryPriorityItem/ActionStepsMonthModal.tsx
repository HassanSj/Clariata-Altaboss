import React, {ReactElement, useState} from "react";
import Modal from "~/ui/components/Dialogs/Modal";
import {MonthData} from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/DirectionStrategySummaryPriorityItem";
import {List, ListItem, ListItemText} from "@material-ui/core";
import moment from "moment";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {ActionItem} from "~/types/api/actionItem";

interface IProps {
    isOpen: boolean;
    onClose: () => unknown;
    data?:MonthData
}

const formatZeros = (val:number) => {
    if(val < 10)
        return `0${val}`
    return `${val}`
}

const ActionStepsMonthModal = ({isOpen, onClose,data}:IProps): ReactElement => {
    const month = data ? formatZeros(data.month+1) : ''
    const title = data ? moment(`${data.year}${month}`,'YYYYMM').format('MMMM YYYY').toString() : ""
    const [ editItem, setEditItem ] = useState<ActionItem|undefined>(undefined)

    return (
        <Modal title={title}
               isOpen={isOpen}
               handleClose={onClose}
               hideFooter={true}>
            <List dense>
                {data?.items.map(item => (
                    <ListItem button onClick={() => setEditItem(item)}>
                        <ListItemText>
                            {item.Description}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            <EditActionItem item={editItem}
                            isOpen={editItem !== undefined}
                            onClose={() => setEditItem(undefined)}
                            onDelete={onClose}
            />
        </Modal>
    )
}

export default ActionStepsMonthModal