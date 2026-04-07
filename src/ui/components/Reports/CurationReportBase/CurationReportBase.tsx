import React from "react";
import {image} from "~/ui/components/Reports/CurationReportBase/helpers";
import styles from './summary/content.module.css'
import * as classnames from "classnames";
import SummaryStyle from "~/ui/components/Reports/CurationReportBase/SummaryStyle";

export interface CurationReportBaseProps {
    householdName: string,
    spousesName: string,
    photo: string,
    children: any,
    title: string
}
// id={classnames(styles.summary)}
const CurationReportBase = (props: CurationReportBaseProps) => {
    return (
        <div>
            <SummaryStyle/>
            <div id={`summary`}>
                <div  className={`${styles['page-wrapper']} ${styles.clearfix} page-wrapper clearfix`}>
                    <div className={`${styles['pw-left']} pw-left`}>
                        <div className={`${styles['pwl-top']} pwl-top`}>
                            <div className={`${styles.logo} logo`}>
                                <img src={image("logo.png")}/>
                            </div>
                            <div className={`${styles['logo-text']} logo-text`}>
                                <p>{props.title} - {props.householdName}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles['pw-right']} pw-right`}>
                        <header className={styles.clearfix}>
                            <div className={`${styles['h-left']} h-left`}>
                                <img src={image("header-graph.png")}/>
                                <p>CURATION SUMMARY report</p>
                            </div>
                            <div className={`${styles['h-right']} h-right`}>
                                <div className={`${styles['hr-wrapper']} ${styles.clearfix} hr-wrapper clearfix`}>
                                    <p>{ props.spousesName }</p>
                                    <img src={ props.photo }/>
                                </div>
                            </div>
                        </header>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurationReportBase;