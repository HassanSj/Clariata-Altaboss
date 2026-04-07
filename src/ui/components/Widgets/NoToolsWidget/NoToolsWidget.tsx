import {useRouter} from "next/router";
import React from "react";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "~/ui/components/Widgets/Widgets.module.scss";
import classnames from "classnames";
import { Icon, IconButton } from "@material-ui/core";
import Modal from "../../Dialogs/Modal";
import ReportsList from "../../Reports/ReportsList";

interface IProps {
  title: string;
  text: string;
  link: string;
  last?: boolean;
  iconClass?: string;
  onClick?: ()=>unknown;
  stories?: boolean;
  isFamily?:boolean;
}

const NoToolsWidget = ({title, text, link, last, iconClass, onClick, stories,isFamily}: IProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);


  const select = () => {
    if(link && link != "")
      router.push(link);
  }

  const icon = iconClass ?? "";

  return (
    <Widget title={title} noContent={true} last={last}>
        <span className={classnames(styles.cl_dark_blue,  styles.cl_icon, { [icon]: iconClass })}></span>
        <span className={styles.cl_box_title}>{title}</span>
        <span className={styles.cl_box_txt}>{text}
        <br/>
       {isFamily
       ? null
       : <IconButton onClick={async () => onClick ? onClick() : stories ? setIsOpen(true) : select() }>
            <Icon className={styles.cl_arrow}>arrow_forward</Icon>
         </IconButton>}
        </span>

        <Modal title={`Client Stories Reports`}
                isOpen={isOpen}
                handleClose={() => setIsOpen(false)}
                width="md"
                hideFooter={true}>
            <ReportsList isModal={true} stories={true} />
        </Modal>
        
    </Widget>
  )
}

export default NoToolsWidget;
