import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid/Grid";
import Item from "@progress/kendo-react-charts/dist/npm/components/legend/Item";
import classnames from "classnames";
import React, { ReactElement } from "react";
import styles from "./Destiny.module.scss";
import MainBody from "./DestinyUi/mainBody";
import DestinyWrapper from "./DestinyWrapper/DestinyWrapper";


const Destiny = (): ReactElement => {
  return (
    <>
      <Card>
        <CardContent>
          <div className={classnames("card-header-image", styles.header_bg)}>
          </div>
        </CardContent>
      </Card>
      <Box display='block'>
        <MainBody />
      </Box>
    </>
  )
}

export default Destiny;
