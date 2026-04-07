import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import Button from "~/ui/components/Button";
import styles from "~/ui/components/Priorities/PriorityItem/PriorityItem.module.scss";
import React from "react";

const ActionItemsTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      {(props?.objective?.ActionItemList && props?.objective?.ActionItemList?.length > 0) ?
        <Button onClick={() => props?.setShowActionItems(!props?.showActionItems)}
                color="primary"
                className={styles.comment_action}
                fullWidth={true}
                text={props?.showActionItems ? `Hide ${props?.objective?.ActionItemList ? props?.objective?.ActionItemList?.length : 0} Action Steps` : `View ${props?.objective?.ActionItemList ? props?.objective?.ActionItemList?.length : 0} Action Steps`}/>
        : null}
    </>
  )
}

export default ActionItemsTemplate;
