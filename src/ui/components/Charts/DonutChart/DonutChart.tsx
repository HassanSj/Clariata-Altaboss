import * as React from 'react';

import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartArea, exportVisual} from '@progress/kendo-react-charts';
import { exportImage } from '@progress/kendo-drawing';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import {Doughnut} from 'react-chartjs-2'

// ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  data: { value: number, color: string, category?: string }[],
  chartDiameter: number,
  line1?: string,
  line2?: string,
  line3?: string,
  showLegend?: boolean,
  lifePrint?: boolean,
}

const labelContent = (props: { dataItem: { value: any; }; }) => {
    return `${props.dataItem.value}`;
}
  
const hideZero = (e: { text: string; createVisual: () => any; }) => {
    if (e.text != "0") {   
        return e.createVisual(); 
    }
}

const DonutChart = ({ data, chartDiameter, line1, line2, line3, showLegend, lifePrint }: IProps) => {

    const innerContent = () => {
        return (
            <div style={{
                lineHeight: 1.2,
                fontSize: lifePrint ? '24px' : '16px',
                fontWeight: 'bold',
                color: '#173E68'
            }}>
                <strong style={{color:'#71C7C7'}}>{line1}</strong><br/>
                <span>{line2}</span><br/>
                <span>{line3}</span>
            </div>
        )
    }

    const [chartImage, setChartImage] = React.useState<string>();

    const chartData = {
        labels: Array.from(data.map(e => e.category)),
        datasets: [
          {
            data: Array.from(data.map(e => e.value)),
            backgroundColor: Array.from(data.map(e => e.color)),
            borderWidth: 0,
          },
        ],
    };

    const options = {
        legend: {
            display: false,
        },
        cutout: chartDiameter/3
    };

    const refContainer = React.useRef<Chart | null>(null);

    const onExportVisual = () => {
        if(refContainer.current) {
            const chartVisual = exportVisual(refContainer.current);
            if (chartVisual) {
                exportImage(chartVisual).then((dataURI: React.SetStateAction<string | undefined>) => setChartImage(dataURI));
            }
        }
    };

    return (
        <>
            {/* {chartImage ? <img id="chartImage" src={chartImage} /> : */}
            <Chart ref={(chart: any) => (refContainer.current = chart)}
            style={{
                width: chartDiameter,
                height: chartDiameter,
            }}
            onRender={onExportVisual}
            renderAs="svg"
            donutCenterRender = {innerContent}
            transitions={false}
            >
                {showLegend ? <ChartLegend position="top" /> : <ChartLegend visible={false} />}
                {/* <ChartArea background="#aa00bb"/> */}
                <ChartSeries >
                    <ChartSeriesItem
                        type="donut"
                        data={data}
                        field="value"
                        colorField="color"
                        categoryField="category"
                        // labels={lifePrint ? undefined : {
                        //     background: 'none',
                        //     visible: true,
                        //     content: labelContent,
                        //     position: 'center',
                        //     color: "#FFFFFF",
                        //     visual: hideZero
                        // }}
                        labels={{
                            background: 'none',
                            visible: true,
                            content: labelContent,
                            position: 'center',
                            color: "#FFFFFF",
                            visual: hideZero
                        }}
                        highlight={{
                            visible: false
                        }}
                        holeSize={chartDiameter/6}
                    />
                </ChartSeries>
            </Chart> 
        </>
        // <>
        // <Doughnut data={chartData} options={options}/>
        // </>
    )
}

export default DonutChart;
