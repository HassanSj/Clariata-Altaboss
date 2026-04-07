import React, { ReactElement} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Icon} from "@material-ui/core";
import style from "./CustomAccrodion.module.css"
import * as classnames from "classnames";
import styles from "~/ui/components/Wizard/Interviews/InterviewStepQuestion/InterviewStepQuestionUpdated.module.scss";
import {hasItems, isNullOrUndefined} from "~/ui/constants/utils";

interface AccordionProps{
    summary: ReactElement|string,
    children: React.ReactNode,
    className?:string,
    showCarrot?:boolean,
    defaultExpanded?:boolean,
    whiteDetails?:boolean
}

/**
 * Custom accordion built on top of MUI
 * @param summary
 * @param children
 * @param className
 * @param defaultExpanded
 * @constructor
 */
const CustomAccordion = ({summary, children,whiteDetails, defaultExpanded = false}:AccordionProps):ReactElement => {
    const [expanded, setExpanded] = React.useState<boolean>(defaultExpanded)

    return (
        <Accordion
            className={classnames(styles.question_container,style.CustomAccordion)}
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}>
            <AccordionSummary
                className={classnames(style.CustomAccordionSummary)}
                expandIcon={<>{expanded ? <Icon>minimize</Icon> : <Icon>add</Icon>}</>}>
                {summary}
            </AccordionSummary>
            <AccordionDetails className={whiteDetails ? "" : styles.responses_details}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default CustomAccordion