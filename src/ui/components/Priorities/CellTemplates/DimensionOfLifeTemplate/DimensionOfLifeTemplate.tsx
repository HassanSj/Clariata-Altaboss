import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import React from "react";
import {useStoreState} from "~/store/hooks";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';

const DimensionOfLifeTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  //const {dimensionsOfLife} = useStoreState(state => state.constants);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);

  return (
    <>
      <DataTableCell
        isLoading={props?.objective?.DimensionOfLifeID ? isNullOrUndefined(props?.dimensionOfLife) : false}
        inputProps={{
          label: "Dimension of life",
          type: 'select',
          labelField: 'DimensionOfLife',
          valueField: 'DimensionOfLifeID',
          items: dimensionsOfLife,
          field: {
            name:'DimensionOfLifeID',
            value:props?.objective?.DimensionOfLifeID
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        {props?.dimensionOfLife?.DimensionOfLife}
      </DataTableCell>
    </>
  )
}

export default DimensionOfLifeTemplate;
