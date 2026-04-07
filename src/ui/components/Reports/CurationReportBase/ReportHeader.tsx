import React from "react";
import styles from '../CurationReportBase/summary/content.module.css'

export interface HeaderProps{
    items: string[]
}

const ReportHeader = ({ items }:HeaderProps) => {
    return (
        <div className={`${styles['bc-heading']} bc-heading`}>
            {items.map((i,index) => (
                <p key={index}>{i}</p>
            ))}
        </div>
    )
}

export default ReportHeader