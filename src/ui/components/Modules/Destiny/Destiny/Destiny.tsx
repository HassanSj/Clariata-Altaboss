import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid/Grid";
import Item from "@progress/kendo-react-charts/dist/npm/components/legend/Item";
import classnames from "classnames";
import { useStoreState } from "easy-peasy";
import React, { ReactElement } from "react";
// import styles from "./Destiny.module.scss";
import MainBody from "./DestinyUi/mainBody";


const Destiny = (): ReactElement => {
  const { selectedHousehold, households } = useStoreState((state) => state.household);

  return (
    <>
      <Card>
        <CardContent>
          <div className={classnames("card-header-image")}>
          </div>
        </CardContent>
      </Card>
      <Box display='block'>
        {selectedHousehold ? <MainBody /> : "No Household Selected"}
      </Box>
    </>
  )
}

export default Destiny;
