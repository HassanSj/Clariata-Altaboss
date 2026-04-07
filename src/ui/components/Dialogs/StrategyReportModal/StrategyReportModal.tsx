import React, {ReactElement, useState} from "react";
import {
    DialogActions, Grid, List, ListItem, ListItemText,
} from "@material-ui/core";
import Modal from "../Modal";
import {addMonths} from "~/ui/constants/utils";
import SelectDate from "../../Forms/SelectDate";
import Button from "../../Button";
import useReports from "~/ui/hooks/useReports";
import ReportViewer from "../../Reports/ReportViewer";
import moment from "moment";
import { ReportType } from "~/ui/constants/reports";

interface IProps {
    onClose: () => unknown,
    isOpen: boolean,
}

const StrategyReportModal = ({onClose, isOpen}:IProps): ReactElement => {
    const [dateRangeSelector,setDateRangeSelector] = React.useState<boolean>(true);

    const [startMonth, setStartMonth] = React.useState<Date>(new Date());
    const [endMonth, setEndMonth] = React.useState<Date>(addMonths((new Date()), 3)!);
    const [startYear, setStartYear] = React.useState<Date>(new Date());
    const [quarter,setQuarter] = React.useState<number>();
    const [reportType, setReportType] = React.useState<ReportType>(ReportType.ACTION_PLAN_SUMMARY_QUARTER);

    const {downloadPdfReport,
        selectedReport,
        selectedReportProps,
        showReport,
        viewReport,
        hideReport} = useReports();

    const printReport = async () => {
        viewReport(reportType, undefined, moment(startYear).year());
    }

    return (
      <Modal title={`Select Report`} isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true}>
        {!dateRangeSelector ? (
          <List>
            <ListItem
              key={1}
              style={{ backgroundColor: '#E9E9E9' }}
              onClick={() => {
                setQuarter(1);
                viewReport(ReportType.ACTION_PLAN_SUMMARY_QUARTER, undefined, moment(startYear).year(), 1);
              }}
            >
              <ListItemText primary="Action Plan Summary Q1" />
            </ListItem>
            <ListItem
              key={2}
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={() => {
                setQuarter(2);
                viewReport(ReportType.ACTION_PLAN_SUMMARY_QUARTER, undefined, moment(startYear).year(), 2);
              }}
            >
              <ListItemText primary="Action Plan Summary Q2" />
            </ListItem>
            <ListItem
              key={3}
              style={{ backgroundColor: '#E9E9E9' }}
              onClick={() => {
                setQuarter(3);
                viewReport(ReportType.ACTION_PLAN_SUMMARY_QUARTER, undefined, moment(startYear).year(), 3);
              }}
            >
              <ListItemText primary="Action Plan Summary Q3" />
            </ListItem>
            <ListItem
              key={4}
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={() => {
                setQuarter(4);
                viewReport(ReportType.ACTION_PLAN_SUMMARY_QUARTER, undefined, moment(startYear).year(), 4);
              }}
            >
              <ListItemText primary="Action Plan Summary Q4" />
            </ListItem>
            {/* <ListItem key={5} style={{ backgroundColor: '#E9E9E9' }} onClick={() => {
                        setQuarter(undefined);
                        setReportType(ReportType.ACTION_PLAN_SUMMARY_QUARTER);
                        setDateRangeSelector(true);
                    }}>
                        <ListItemText primary="Action Plan Summary Custom Date Range"/>
                    </ListItem>
                    <ListItem key={6} style={{ backgroundColor: '#FFFFFF' }} onClick={() => {
                        setQuarter(undefined);
                        setReportType(ReportType.GANTT_CHART);
                        setDateRangeSelector(true);
                    }}>
                        <ListItemText primary="Gantt Chart"/>
                    </ListItem> */}
          </List>
        ) : null}
        {dateRangeSelector ? (
          <>
            <Grid container className="m-t-20" spacing={2}>
              <Grid item xs={4}>
                <SelectDate
                  type="month"
                  label="Start Month"
                  field={{ value: startMonth }}
                  onChange={(e: { target: { value: any } }) => {
                    setStartMonth(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SelectDate
                  type="month"
                  label="End Month"
                  field={{ value: endMonth }}
                  onChange={(e: { target: { value: any } }) => {
                    setEndMonth(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SelectDate
                  type="year"
                  label="Start Year"
                  field={{ value: startYear }}
                  onChange={(e: { target: { value: any } }) => {
                    setStartYear(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </>
        ) : null}

        <DialogActions>
          {dateRangeSelector ? (
            <Button
              type="button"
              text={`Done`}
              variant="contained"
              size="large"
              color="default"
              onClick={async () => {
                viewReport(ReportType.ACTION_PLAN_SUMMARY_QUARTER,
                           undefined,
                           moment(startYear).year(),
                           4,
                           moment(startMonth).month(),
                           moment(endMonth).month()
                );
                // onClose();
              }}
            />
          ) : null}
        </DialogActions>
        {selectedReport ? (
          <ReportViewer
            definition={selectedReport}
            props={selectedReportProps}
            isOpen={showReport}
            onClose={() => hideReport()}
            onDownload={() => downloadPdfReport(selectedReport.type, undefined, moment(startYear).year(), quarter)}
          />
        ) : null}
      </Modal>
    );
}

export default StrategyReportModal
                