import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import React from "react";
import {useStoreState} from "~/store/hooks";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';

const MetricOfSuccessTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  //const {metricsOfSuccess} = useStoreState(state => state.constants);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);

  return (
    <>
      <DataTableCell isLoading={props?.objective?.MetricOfSuccessID ? isNullOrUndefined(props?.metricOfSuccess) : false}
                     inputProps={{
                       label: 'Metric of success',
                       type: 'select',
                       labelField: 'MetricOfSuccess',
                       valueField: 'MetricOfSuccessID',
                       items: metricsOfSuccess,
                       field: {
                         name:'MetricOfSuccessID',
                         value:props?.objective?.MetricOfSuccessID
                       }
                     }}
                     onSave={(e) => props?.onUpdateFields(e)}>
        {props?.metricOfSuccess?.MetricOfSuccess}
      </DataTableCell>
    </>
  )
}

export default MetricOfSuccessTemplate;
