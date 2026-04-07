import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import styles from "~/ui/components/ActionItems/ActionItem/ActionItem.module.scss";
import {toDate} from "~/ui/constants/utils";
import React from "react";
import {actionItemStatuses} from "~/ui/constants/tasks";

const StatusTemplate = ({ props }: IActionItemCellTemplateConfig) => {

  const computedIsInProgress = () => {
    return props.item.ActionItemStatusID === 2
  }

  const computedStatus = () => {
    const filtered = actionItemStatuses.filter(status => status.ActionItemStatusID === props.item.ActionItemStatusID)
    return filtered[0].Description;
  }
  
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'Description',
          valueField: 'ActionItemStatusID',
          items: actionItemStatuses,
          label: 'Status',
          field: {
            name:'ActionItemStatusID',
            value:props?.item?.ActionItemStatusID
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <div>
          <div>{computedStatus()}</div><br />
          {/*<div className={styles.item_cell_bottom}>*/}
          {/*  <span>*/}
          {/*     { computedIsInProgress() ?*/}
          {/*       <span>Started on {toDate(props?.item?.StartDate?.toString())}</span>*/}
          {/*       : null }*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>
      </DataTableCell>
    </>
  )
}

export default StatusTemplate;