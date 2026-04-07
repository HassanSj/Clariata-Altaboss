import Icon from "@material-ui/core/Icon";
import React from "react";
import {useRouter} from "next/router";
import {useStoreState} from "~/store/hooks";
import paths from "~/ui/constants/paths";
import Widget from "~/ui/components/Widgets/Widget";
import classnames from "classnames";
import styles from "./../Widgets.module.scss";
import { Button } from "@material-ui/core";


const { DEEPEN } = paths;

const DeepenWidget = () => {
  const router = useRouter();
  const goToTasks = () => {
    router.push(`${DEEPEN}`);
  }

  return (
    <>
      <Widget title="Deepen">
        <span className={classnames(styles.cl_green, styles.cl_icon, styles.cl_icon_discover)}/>
        <span className={styles.cl_box_title}>Deepen</span>
        <span className={styles.cl_box_txt}>
          <div>
            Deepen sets the course for the advisor and their team to implement and execute their clients' LifeMap Strategies.
          </div>
          <div style={{marginTop: "20px"}}>
            Deepen Module will be available soon.
          </div>
          </span>
        {/* <div className={styles.cl_bottom}>
          <span className={styles.cl_box_tools}>
            <Button fullWidth={true}
                    onClick={() => goToTasks()}
                    color="primary"
                    variant="text"
                    className={styles.cl_box_button}>
              Continue
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
          </span>
        </div> */}
      </Widget>

    </>
  )
}

export default DeepenWidget;
