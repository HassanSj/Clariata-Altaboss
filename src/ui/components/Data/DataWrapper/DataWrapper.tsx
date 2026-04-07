import React, {ReactElement} from 'react';
import ListedData from "~/ui/components/Data/ListedData";
import GroupedData from "~/ui/components/Data/GroupedData";
import {IDataItemEventConfig} from "~/types/data";

interface IProps {
  isGrouped?: boolean;
  paginator?: any;
  data?: any[]
  component: any;
  componentProps?: {[key:string]:any}
  keyLabel: string;
  propLabel: string;
  views?: any;
  eventConfig?: IDataItemEventConfig;
  isDragging?: boolean;
    hideShowAll?:boolean;
}

const DataWrapper = ({ isGrouped = false,
                       component, componentProps,
                       keyLabel,
                       propLabel,
                       views,
                       paginator,
                       eventConfig,
                         hideShowAll,
                       data,
                       isDragging }: IProps): ReactElement => {

  return (
    <>
      { !isGrouped ?
        <ListedData paginator={paginator}
                    data={data}
                    keyLabel={keyLabel}
                    propLabel={propLabel}
                    views={views}
                    hideShowAll={hideShowAll}
                    component={component}
                    eventConfig={eventConfig}
                    componentProps={componentProps}
                    isDragging={isDragging} />
        : null }
      { isGrouped ?
        <GroupedData paginator={paginator}
                     propLabel={propLabel}
                     views={views}
                     component={component} />
        : null }
    </>
  )
};

export default DataWrapper;
