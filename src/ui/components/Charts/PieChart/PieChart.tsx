import * as React from 'react';

import {Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartSeriesLabels} from '@progress/kendo-react-charts';

interface IProps {
  data: any,
}

const labelContent = (e: any) => (e.category);

const PieChart = ({ data }: IProps) => {

  return (
    <>
      <Chart>
        <ChartSeries>
          <ChartSeriesItem type="donut"
                           data={data}
                           categoryField="kind"
                           field="share">
            <ChartSeriesLabels color="#fff"
                               background="none"
                               content={labelContent} />
          </ChartSeriesItem>
        </ChartSeries>
        <ChartLegend visible={false} />
      </Chart>
    </>
  )
}

export default PieChart;
