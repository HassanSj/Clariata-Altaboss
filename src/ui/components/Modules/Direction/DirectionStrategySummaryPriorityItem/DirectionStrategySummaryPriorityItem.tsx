import {Objective} from "~/types/api/objective";
import classnames from "classnames";
import styles
    from "~/ui/components/Modules/Direction/DirectionStrategyActionItem/DirectionStrategyActionItem.module.scss";
import monthStyles from "./DirectionStrategySummaryPriorityItem.module.css"
import React, {useState} from "react";
import {Chip, Grid} from "@material-ui/core";
import ObjectiveDescriptionTemplate
    from "~/ui/components/ActionItems/CellTemplates/DescriptionTemplate/ObjectiveDescriptionTemplate";
import {ActionItem} from "~/types/api/actionItem";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import DraggableActionItem
    from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/DraggableActionItem";
import ActionItemDropTarget
    from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/ActionItemDropTarget";
import {useStoreState} from "~/store/hooks";
import ActionStepsMonthModal
    from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/ActionStepsMonthModal";

interface IProps {
    item: Objective;
    index?: number;
    onChange?: any;
}

const DirectionStrategySummaryPriority = ({ item }: IProps) => {
    const {selectedObjectiveIds} = useStoreState(state => state.objective);
    const selected = selectedObjectiveIds[item?.ObjectiveID] ?? false

    return (
        <div className={classnames("item_card")} >
            <div className={"item_content"} >
                <Grid container spacing={1}  style={{height: 100}}>
                    <Grid item xs={12}>
                        <div className={classnames("item_cell", "item_cell_first",{"selected":selected})} style={{whiteSpace:"normal", borderRight:"5px solid #183f69"}}>
                            <ObjectiveDescriptionTemplate props={{
                                item,
                            }}/>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export interface MonthData {
    items: ActionItem[];
    month: number,
    year: number
}

export interface MonthRow{
    columns: MonthData[];
    id: string;
}

interface MonthProps{
    item: MonthRow;
    index: number;
    onChange?: any;
    onCloseRow: (index: number) => void,
    onOpenRow: (index: number) => void,
}

export const DirectionStrategySummaryPriorityMonth = ({ item }: MonthProps) => {
    const [ openMonth, setOpenMonth ] = useState<MonthData | undefined>()
    const [ editItem, setEditItem ] = useState<ActionItem|undefined>(undefined)

    const {selectedObjectiveIds} = useStoreState(state => state.objective);
    const selected = selectedObjectiveIds[item?.id] ?? false

    const closeRow = () => {
        setOpenMonth(undefined)
    }

    const openRow = (data:MonthData) => {
        setOpenMonth(data)
    }

    const toggleRow = (data:MonthData|undefined) => {
        if(openMonth){
            closeRow()
        }else{
            openRow(data!)
        }
    }

    return (
        <>
            <div className={classnames("item_card", styles.item_clickable)}>
                <div className={"item_content"}>
                    <Grid container spacing={1} style={{height: 100}}>
                        {item.columns.map((data: MonthData) => (
                            <ActionItemDropTarget selected={selected} targetMonth={data.month} targetYear={data.year} onDropEnd={closeRow} objectiveID={item.id}>
                                    {data.items.length > 0 ? (
                                        <>
                                            <div style={{ display:" flex", flexDirection: "column"}}>  
                                                {data.items.map(data => 
                                                <DraggableActionItem item={data} onClick={setEditItem} objectiveID={item.id}/>)
                                                }
                                            </div>
                                            {/* {data.items.length > 1 && (
                                                <div className={monthStyles.actionItemWrapper}>
                                                    <Chip className={styles.tab_count}
                                                          size="small"
                                                          color="secondary"
                                                          label={(openMonth ? "-": "+")+`${data.items.length}`}
                                                          onClick={() => {
                                                              toggleRow(data)
                                                          }}
                                                    />
                                                </div>
                                            )} */}
                                        </>
                                    ) : <span style={{opacity:'0'}}>&nbsp;</span>}
                            </ActionItemDropTarget>
                        ))}
                    </Grid>
                </div>
            </div>
            <ActionStepsMonthModal
                key={JSON.stringify(openMonth)}
                data={openMonth}
                isOpen={openMonth !== undefined}
                onClose={() => setOpenMonth(undefined)}/>
            {/*{openMonth && (*/}
            {/*    <div className={classnames("item_card", styles.item_clickable)} style={{display:"block"}}>*/}
            {/*        <div className={"item_content"}>*/}
            {/*            <Grid container style={{height: 92, backgroundColor: "#e9e9e9"}}>*/}
            {/*                {(beforeOpenMonth && (beforeOpenMonth > 0)) ?*/}
            {/*                    <Grid item xs={beforeOpenMonth!}><div className={classnames("item_cell")} style={{display:"block"}}/></Grid>*/}
            {/*                : null}*/}
            {/*                <Grid item xs={1}>*/}
            {/*                    <div className={classnames("item_cell")} style={{display:"block"}}>*/}
            {/*                        {openMonth.items.map((m) => (*/}
            {/*                            <>*/}
            {/*                                <DraggableActionItem item={m} onClick={setEditItem} objectiveID={item.id}/>*/}
            {/*                            </>*/}
            {/*                        ))}*/}
            {/*                    </div>*/}
            {/*                </Grid>*/}
            {/*                /!*<Grid item xs={afterOpenMonth}><div className={classnames("item_cell")} style={{display:"block"}}/></Grid>*!/*/}
            {/*            </Grid>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            <EditActionItem item={editItem}
                            isOpen={editItem !== undefined}
                            onClose={() => setEditItem(undefined)}
                            onDelete={closeRow}
            />
        </>
    )
}

export default DirectionStrategySummaryPriority