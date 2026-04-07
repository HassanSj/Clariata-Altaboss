import React, {ReactElement} from 'react';
import classnames from 'classnames';
import {Grid} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import {IDataItemEventConfig} from "~/types/data";
import {isNullOrUndefined} from "~/ui/constants/utils";


interface IProps {
  index?: number;
  checklistItem: any;
  views: any;
  onChange?: any;
  eventConfig?: IDataItemEventConfig;
  dragEnabled: boolean;
}

const checklistTemplate = ({checklistItem, views}: IProps): ReactElement => {
  const {selectedHousehold} = useStoreState(state => state.household);
  return (
    <>

      <div className={classnames("item_card")}>
        <div className={"item_content"}>
          <Grid container spacing={1}>
            {views?.getCurrentHeaders()?.map((i: any, iIndex: number) => {
                return (
                  <Grid container item xs={i?.width} key={iIndex} alignContent="center">
                    <div className={classnames("item_cell", { ["item_cell_first"]: iIndex === 0 })}>
                      {!isNullOrUndefined(i?.component) ? React.createElement(
                          i.component,
                          {
                            props: {
                              key: `${checklistItem?.HouseholdChecklistItemID}-${iIndex}`,
                              checklistItem,
                              household: selectedHousehold,
                              locked: true
                            }
                          },
                        ) : null}
                    </div>
                  </Grid>
                )
            })}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default checklistTemplate;
