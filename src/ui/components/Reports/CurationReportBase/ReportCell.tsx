import React from "react";
import styles from '../CurationReportBase/summary/content.module.css'

const ReportCell = (props:any) => (
    <div className={`${styles['bc-col']} bc-col`}>
        {props.children}
    </div>
)

export default ReportCell;