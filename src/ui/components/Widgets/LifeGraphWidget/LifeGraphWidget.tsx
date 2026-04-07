import {Button} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {useRouter} from "next/router";
import {useStoreState, useStoreActions} from "~/store/hooks";
import paths from "~/ui/constants/paths";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "../Widgets.module.scss";
import classnames from "classnames";
import { BOTH_PERSONS_OPTION } from "~/services/interview";
import { Chart, ChartArea, ChartLegend, ChartSeries, ChartSeriesItem } from "@progress/kendo-react-charts";
import api from "~/services/api";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { getChartImages } from "../../Reports/LifeGraphReport/LifeGraphReport";

const { INTERVIEW } = paths;

export const chartColors = [ '#71C7C7', '#173E68', '#F15929', '#DDDDDD' ];
export const chartColorsToClasses = [
  {
    color: '#71C7C7',
    value: styles.cl_light_blue_circle
  },
  {
    color: '#173E68',
    value: styles.cl_dark_blue_circle
  },
  {
    color: '#F15929',
    value: styles.cl_dark_red_circle
  },
  {
    color: '#DDDDDD',
    value: styles.cl_gray_circle,
  }
]

const LifeGraphWidget = () => {
  const router = useRouter();
  const {selectedHousehold} = useStoreState(state => state.household);
  const {dreamInterviewId, selectedInterview} = useStoreState(state => state.interview);
  const {wizard} = useStoreState(state => state.wizard);
  const [selectablePersons, setSelectablePersons] = React.useState((selectedHousehold?.Persons && selectedHousehold?.Persons?.length > 1) ? [BOTH_PERSONS_OPTION, ...selectedHousehold?.Persons] : (selectedHousehold?.Persons && selectedHousehold?.Persons?.length == 1) ? [selectedHousehold?.Persons[0]] : [BOTH_PERSONS_OPTION]);
  const [isMetric, setIsMetric] = React.useState(false);
  
  const getChartData = async() => {

    // 
    let primaryPersonIds = [0];
    if(selectedHousehold?.PrimaryPerson1ID) primaryPersonIds.push(selectedHousehold?.PrimaryPerson1ID);
    if(selectedHousehold?.PrimaryPerson2ID) primaryPersonIds.push(selectedHousehold?.PrimaryPerson2ID);

    const metricRes = await api.metricofsuccess.list();
    const metrics = metricRes?.data;
    const dimensionRes = await api.dimensionofsuccess.list();
    const dimensions = dimensionRes?.data;

    const interview = await api.interview.getFull(selectedHousehold?.HouseholdID, dreamInterviewId);

    let chartData:{ value:number, color:string, category?:string }[][] = [];
    interview?.QuestionsAndResponses?.map(qr => {
      const id = isMetric ? qr.Question?.MetricOfSuccessID : qr?.Question?.DimensionOfLifeID;
      if(typeof id != 'undefined'){
        if(qr.Responses && qr.Responses?.length > 0) {
            qr.Responses.forEach(r => {
              if(typeof r.AppliesTo != 'undefined') {
                chartData[r.AppliesTo] = ( typeof chartData[r.AppliesTo] != 'undefined' ) ? chartData[r.AppliesTo] : [];
                chartData[r.AppliesTo][id] = ( typeof chartData[r.AppliesTo][id] != 'undefined') ? chartData[r.AppliesTo][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
                chartData[r.AppliesTo][id].value = ( chartData[r.AppliesTo][id].value != 0) ? chartData[r.AppliesTo][id].value + 1 : 1;

                //Add for both if spouse, and for spouses if both
                if(r.AppliesTo == 0)
                {
                  primaryPersonIds.forEach(p => {
                    chartData[p] = ( typeof chartData[p] != 'undefined' ) ? chartData[p] : [];
                    chartData[p][id] = ( typeof chartData[p][id] != 'undefined') ? chartData[p][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
                    chartData[p][id].value = ( chartData[p][id].value != 0) ? chartData[p][id].value + 1 : 1;
                  })
                } else {
                  chartData[0] = ( typeof chartData[0] != 'undefined' ) ? chartData[0] : [];
                  chartData[0][id] = ( typeof chartData[0][id] != 'undefined') ? chartData[0][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
                  chartData[0][id].value = ( chartData[0][id].value != 0) ? chartData[0][id].value + 1 : 1;
                }
              }
            });
        } else {
          primaryPersonIds.forEach(p => {
            chartData[p] = ( typeof chartData[p] != 'undefined' ) ? chartData[p] : [];
            chartData[p][id] = ( typeof chartData[p][id] != 'undefined') ? chartData[p][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
          })
        }
      }
    });

    const chartImages = await getChartImages(chartData, undefined, undefined, isMetric, false, true, 'EFF5F6', 40);

    return {
      chartData,
      chartImages
    };
  }
  
  const [chartData,setChartData] = React.useState<{value:number, color:string, category?:string }[][]>();
  const [chartImages,setChartImages] = React.useState<string[]>();

  const select = async () => {
    router.push(`${INTERVIEW}/${dreamInterviewId}?showGrid=false`);
  }

  const [activeProfile,setActiveProfile] = React.useState(selectablePersons[0]);

  useMountEvents({
    onMounted: async () => {
      const cd = await getChartData();
      setChartData(cd.chartData);
      setChartImages(cd.chartImages);
    },
    onChange: async () => {
      const cd = await getChartData();
      setChartData(cd.chartData);
      setChartImages(cd.chartImages);
    },
    watchItems: [selectedInterview, wizard, isMetric]
  });


  return (
    <>
      <Widget title="LifeGraph" tabs={true}>
        <span className={classnames(styles.cl_light_blue,  styles.cl_icon, styles.cl_icon_discover)}></span>
        <div className={styles.cl_tabs_nav}>
            <Button onClick={() => setIsMetric(false)}

                    color="primary"
                    variant="text"
                    className={!isMetric ? classnames(styles.selected) : classnames(styles.cl_tab_nav_item)}>
                    Metrics of of Success
            </Button>
            <Button onClick={() => setIsMetric(true)}
                    color="primary"
                    variant="text"
                    className={isMetric ? classnames(styles.selected) : classnames(styles.cl_tab_nav_item)}>
                    Dimensions of Life
            </Button>
          {selectablePersons?.map(p => {
            return (
              <Button
                onClick={() => setActiveProfile(p)}
                color="primary"
                variant="text"
                className={
                  activeProfile?.PersonID == p?.PersonID
                    ? classnames(styles.cl_box_title, styles.selected)
                    : classnames(styles.cl_data)
                }
                disabled={activeProfile?.PersonID == p?.PersonID ? true : false}
              >
                View {p.FirstName}
              </Button>
            );
          })}
        </div>
          <div className={styles.cl_tabs_tab}>
            <div className={styles.cl_tab_content}>
              <div className={styles.cl_tab_chart}>
                {chartImages && chartImages[activeProfile?.PersonID] ?
                <img style={{maxWidth: '90%'}} src={chartImages[activeProfile?.PersonID]}/> : null}
              </div>
              <div className={styles.cl_tab_smmary}>
              {chartData && chartData[activeProfile?.PersonID] ?
                <>
                  <span className={styles.cl_box_white}>{activeProfile?.FirstName} Profile</span>
                  <span className={styles.cl_box_title}>{isMetric ? "Dimensions of Life" : "Metrics of Success"}</span>
                  <span className={styles.cl_chart_summary}>
                  {chartData[activeProfile?.PersonID].map(cd => {
                    return (
                      <span className={classnames(styles.cl_chart_summary_item, chartColorsToClasses.find(c => c.color == cd.color)?.value)}><strong>{cd.value} </strong>{cd.category}</span>
                    )
                  })}
                  </span>
                </>
                : null }
              </div>
            </div>
           
          </div>
        

      </Widget>

    </>
  )
}

export default LifeGraphWidget;
