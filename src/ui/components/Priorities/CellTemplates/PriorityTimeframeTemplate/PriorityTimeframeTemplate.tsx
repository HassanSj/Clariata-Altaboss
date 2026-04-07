import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {Button, ButtonGroup, ListItem} from "@material-ui/core";
import React from "react";
import {useStoreState} from "~/store/hooks";
import { Timeframe } from "~/types/api/timeframe";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';

const PriorityTimeframeTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  //const { timeframes } = useStoreState(state => state.constants);
  const { data: timeframes } = useSWR<Timeframe[]>([`${process.env.NEXT_PUBLIC_API_URL}/timeframe/list`, getAccessToken()], fetcher);
  
  //const { data: metricsOfSuccess } = useSWR<Timeframe[]>([`${process.env.NEXT_PUBLIC_API_URL}/timeframe/list`, getAccessToken()], fetcher);

  const toggle = async (val: number) => {
    props?.onSelect();
    props?.onUpdateFields([
      {
        field: 'TimeframeID',
        value: props?.objective?.TimeframeID === val ? 0 : val
      }
    ])
  }
// (props?.locked && props?.objective?.TimeframeID === t?.TimeframeID) || !props?.locked ?
  return (
    <>
      <DataTableCell>
          <ListItem>
            <ButtonGroup fullWidth={true}
                         color="primary"
                         disableElevation={true}
                         variant="contained">
              {timeframes?.map((t: any, index: number) =>
                  <Button key={index}
                          color={(props?.objective?.TimeframeID === t?.TimeframeID) ? 'primary' : 'default'}
                          // className={(props?.objective?.TimeframeID === t?.TimeframeID) ? 'active' : 'not-active'}
                          onClick={() => toggle(t?.TimeframeID)}>{t?.Description}</Button>
              )}
            </ButtonGroup>
          </ListItem>
      </DataTableCell>
    </>
  )
}

export default PriorityTimeframeTemplate;
