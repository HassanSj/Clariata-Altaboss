import {useRouter} from "next/router";
import React from "react";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "~/ui/components/Widgets/Widgets.module.scss";
import {Button, Grid} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import paths from "~/ui/constants/paths";
import classnames from "classnames";
import BarProgressIndicator from "../../Indicators/BarProgressIndicator";

const { DESTINY } = paths;

const DestinyWidget = () => {
  const router = useRouter();

  const select = () => {
    router.push(DESTINY);
  }

  return (
    <Widget title={'Destiny'}>
        <span className={classnames(styles.cl_orange, styles.cl_icon, styles.cl_icon_discover)}/>
        <span className={styles.cl_box_title}>Destiny</span>
        <span className={styles.cl_box_txt}>
          <div>
          Destiny provides guidance and resources advisors can use to establish development plans for family members to educate, prepare, and position them to take on the roles and responsibilities associated with their family's LifeMap Strategy.
          </div>
          <div style={{marginTop: "20px"}}>
            Destiny Module will be available soon.
          </div>
        </span>
        {/* <div className={styles.cl_bottom}>        
        </div> */}
    </Widget>
  )
}

export default DestinyWidget;
