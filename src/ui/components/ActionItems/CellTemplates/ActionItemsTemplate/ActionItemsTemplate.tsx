import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import Button from "~/ui/components/Button";
import styles from "~/ui/components/ActionItems/ActionItem/ActionItem.module.scss";
import React from "react";

const ActionItemsTemplate = ({ props }: IActionItemCellTemplateConfig) => {
  return (
    <>
      { (props?.item?.ActionItemList && props?.item?.ActionItemList?.length > 0) ?
        <Button onClick={() => props?.setShowActionItems(!props?.showActionItems)}
                fullWidth={true}
                color="primary"
                size="small"
                className={styles.comment_action}
                text={props?.showActionItems ? `Hide ${props?.item?.ActionItemList ? props?.item?.ActionItemList?.length : 0} Child Items` : `View ${props?.item?.ActionItemList ? props?.item?.ActionItemList?.length : 0} Child Action Steps`} />
        : null }
    </>
  )
}

export default ActionItemsTemplate;
