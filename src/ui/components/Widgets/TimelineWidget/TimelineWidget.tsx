import {useRouter} from "next/router";
import React from "react";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "../Widgets.module.scss";
import classnames from "classnames";
import { Button, Icon, IconButton } from "@material-ui/core";
import Modal from "../../Dialogs/Modal";
import ReportsList from "../../Reports/ReportsList";

interface IProps {
  title: string;
  text: string;
  iconClass?: string;
  goToTimeline: () => unknown;
  goToCustomEvents: () => unknown;
}

const TimelineWidget = ({title, text, iconClass, goToTimeline, goToCustomEvents}: IProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);



  const icon = iconClass ?? "";

  return (
    <Widget
     title={title} noContent={true}>
        <span className={classnames(styles.cl_dark_blue,  styles.cl_icon, { [icon]: iconClass })}></span>
        <span className={styles.cl_box_title}>{title}</span>
        <span className={styles.cl_box_txt}>{text}
        </span> 
        <div className={styles.cl_bottom}>
          <span className={styles.cl_box_tools}>
            <Button
              fullWidth={true}
              onClick={() => goToTimeline()}
              color="primary"
              variant="text"
              className={styles.cl_box_button}
            >
              View Timeline
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
            <Button
              fullWidth={true}
              onClick={() => goToCustomEvents()}
              color="primary"
              variant="text"
              className={styles.cl_box_button}
            >
              Manage Custom Events
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
          </span>
        </div> 
    </Widget>
  )
}

export default TimelineWidget;
